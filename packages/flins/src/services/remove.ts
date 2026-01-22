import * as p from "@clack/prompts";
import pc from "picocolors";
import { rmSync } from "fs";
import { removeSkill } from "@/core/state/global";
import { removeLocalSkill } from "@/core/state/local";
import { listTrackedInstallables, getValidInstallations } from "@/core/state/combined";
import type { InstallableType } from "@/types/skills";
import { agents } from "@/config";
import { showNoSkillsMessage, plural } from "@/utils/formatting";
import { removeSymlinkSource } from "@/infrastructure/file-system";

interface RemoveResult {
  skillName: string;
  success: boolean;
  removed: number;
  failed: number;
  installations: Array<{ agent: string; path: string; removed: boolean; error?: string }>;
}

interface RemoveOptions {
  yes?: boolean;
  force?: boolean;
  silent?: boolean;
}

async function removeSkillDirectory(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    rmSync(path, { recursive: true, force: true });
    return { success: true };
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === "ENOENT") {
      return { success: true };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function performRemove(
  skillNames: string[] = [],
  options: RemoveOptions = {},
): Promise<RemoveResult[]> {
  const allSkills = listTrackedInstallables();
  const results: RemoveResult[] = [];

  if (allSkills.length === 0) {
    showNoSkillsMessage();
    return [];
  }

  let skillsToRemove: typeof allSkills;

  if (skillNames.length > 0) {
    const nameSet = new Set(skillNames.map((n) => n.toLowerCase()));
    skillsToRemove = allSkills.filter(({ name }) => nameSet.has(name.toLowerCase()));
  } else {
    const allChoices = allSkills.map(({ name, isLocal, installableType }) => {
      const validInstallations = getValidInstallations(name, installableType, { isLocal });

      return {
        value: name,
        label: name,
        hint:
          validInstallations.length > 0
            ? `${validInstallations.length} ${plural(validInstallations.length, "installation")}`
            : "no valid installations",
      };
    });

    const validChoices = allChoices.filter((c) => c.hint !== "no valid installations");

    if (validChoices.length === 0) {
      p.log.warn("No valid installations found");
      return [];
    }

    const autoConfirm = options.yes || options.force;

    if (autoConfirm) {
      skillsToRemove = allSkills.filter(({ name }) => validChoices.some((c) => c.value === name));
    } else {
      const selected = await p.multiselect({
        message: "Choose skills to remove",
        options: validChoices,
        required: true,
        initialValues: validChoices.map((c) => c.value),
      });

      if (p.isCancel(selected)) {
        p.cancel("Remove cancelled");
        return [];
      }

      const selectedNames = selected as string[];
      skillsToRemove = allSkills.filter(({ name }) => selectedNames.includes(name));
    }
  }

  if (skillsToRemove.length === 0) {
    if (skillNames.length > 0) {
      p.log.error(`No matching skills found for: ${skillNames.join(", ")}`);
      p.log.info("Tracked skills:");
      for (const s of allSkills) {
        p.log.message(`  - ${pc.cyan(s.name)}`);
      }
    }
    return [];
  }

  p.log.step(pc.bold("Skills to Remove"));

  const toRemove: Array<{
    name: string;
    isLocal: boolean;
    installableType: InstallableType;
    installations: Array<{
      installation: import("@/types/state").SkillInstallation;
      resolvedPath: string;
    }>;
  }> = [];

  for (const { name, isLocal, installableType } of skillsToRemove) {
    const validInstallations = getValidInstallations(name, installableType, { isLocal });

    if (validInstallations.length > 0) {
      toRemove.push({ name, isLocal, installableType, installations: validInstallations });
      const agentNames = validInstallations.map(
        ({ installation }) => agents[installation.agent].displayName,
      );
      p.log.message(`  ${pc.cyan(name)} ${pc.dim(`(${agentNames.join(", ")})`)}`);
    }
  }

  if (toRemove.length === 0) {
    p.log.warn("No installations match the specified criteria");
    return [];
  }

  const skipSecondMultiselect = skillNames.length === 0;

  let selectedToRemove: string[];

  const autoConfirm = options.yes || options.force;

  if (autoConfirm || skipSecondMultiselect) {
    selectedToRemove = toRemove.map(({ name }) => name);
  } else {
    const removeChoices = toRemove.map(({ name, installations }) => ({
      value: name,
      label: name,
      hint: `${installations.length} ${plural(installations.length, "installation")}`,
    }));

    const selected = await p.multiselect({
      message: "Choose skills to remove",
      options: removeChoices,
      required: true,
      initialValues: toRemove.map(({ name }) => name),
    });

    if (p.isCancel(selected)) {
      p.cancel("Remove cancelled");
      return [];
    }

    selectedToRemove = selected as string[];
  }

  p.log.step(pc.bold("Will Remove"));
  for (const skillName of selectedToRemove) {
    const item = toRemove.find((r) => r.name === skillName);
    if (item) {
      p.log.message(`  ${pc.cyan(item.name)}`);
    }
  }

  if (!autoConfirm) {
    const confirmed = await p.confirm({ message: "Remove selected skills?" });
    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Remove cancelled");
      return [];
    }
  }

  const spinner = p.spinner();
  spinner.start("Removing...");

  for (const { name, isLocal, installableType, installations } of toRemove) {
    if (!selectedToRemove.includes(name)) {
      continue;
    }
    const result: RemoveResult = {
      skillName: name,
      success: true,
      removed: 0,
      failed: 0,
      installations: [],
    };

    for (const { installation, resolvedPath } of installations) {
      const symlinkSourceResult = await removeSymlinkSource(resolvedPath);

      const removeResult = await removeSkillDirectory(resolvedPath);

      result.installations.push({
        agent: agents[installation.agent].displayName,
        path: resolvedPath,
        removed: removeResult.success && symlinkSourceResult.success,
        error: removeResult.error || symlinkSourceResult.error,
      });

      if (removeResult.success && symlinkSourceResult.success) {
        result.removed++;
      } else {
        result.failed++;
        result.success = false;
      }
    }

    if (result.removed > 0) {
      if (isLocal) {
        removeLocalSkill(name, installableType);
      } else {
        removeSkill(name, installableType);
      }
    }

    results.push(result);
  }

  spinner.stop("Remove complete");

  const successful = results.filter((r) => r.success && r.removed > 0);
  const failed = results.filter((r) => !r.success || r.failed > 0);

  if (successful.length > 0) {
    p.log.success(pc.green(`Removed successfully`));
    for (const r of successful) {
      p.log.message(`  ${pc.green("✓")} ${pc.cyan(r.skillName)}`);
    }
  }

  if (failed.length > 0) {
    p.log.error(pc.red(`Failed to remove ${failed.length} ${plural(failed.length, "skill")}`));
    for (const r of failed) {
      p.log.message(`  ${pc.red("✗")} ${pc.cyan(r.skillName)}`);
      for (const inst of r.installations.filter((i) => !i.removed)) {
        if (inst.error) {
          p.log.message(`    ${pc.dim(inst.error)}`);
        }
      }
    }
  }

  if (successful.length > 0) {
    p.outro(pc.green("Done! Skills removed."));
  } else {
    p.outro(pc.yellow("Nothing removed"));
  }

  return results;
}

export async function listRemovableSkills(): Promise<void> {
  const allSkills = listTrackedInstallables();

  if (allSkills.length === 0) {
    showNoSkillsMessage();
    return;
  }

  p.log.step(pc.bold("Installed Skills and Commands"));

  const localSkills: Array<{ name: string; installableType: InstallableType }> = [];
  const globalSkills: Array<{ name: string; installableType: InstallableType }> = [];

  for (const { name, isLocal, installableType } of allSkills) {
    if (isLocal) {
      localSkills.push({ name, installableType });
    } else {
      globalSkills.push({ name, installableType });
    }
  }

  if (localSkills.length > 0) {
    if (globalSkills.length > 0) {
      p.log.message(pc.bold(pc.cyan("Local (from ./skills.lock)")));
    }
    for (const { name, installableType } of localSkills) {
      const validInstallations = getValidInstallations(name, installableType, { isLocal: true });

      const agentNames = validInstallations.map(
        ({ installation }) => agents[installation.agent].displayName,
      );
      const typeLabel = installableType === "command" ? pc.yellow("⚡") : pc.green("✓");

      p.log.message(
        `${typeLabel} ${pc.cyan(name)} ${agentNames.length > 0 ? pc.dim(`(${agentNames.join(", ")})`) : ""}`,
      );
    }
  }

  if (globalSkills.length > 0) {
    if (localSkills.length > 0) {
      p.log.message(pc.bold(pc.cyan("Global (from ~/.flins/skills.lock)")));
    }
    for (const { name, installableType } of globalSkills) {
      const validInstallations = getValidInstallations(name, installableType, { isLocal: false });

      const agentNames = validInstallations.map(
        ({ installation }) => agents[installation.agent].displayName,
      );
      const typeLabel = installableType === "command" ? pc.yellow("⚡") : pc.green("✓");

      p.log.message(
        `${typeLabel} ${pc.cyan(name)} ${agentNames.length > 0 ? pc.dim(`(${agentNames.join(", ")})`) : ""}`,
      );
    }
  }
}
