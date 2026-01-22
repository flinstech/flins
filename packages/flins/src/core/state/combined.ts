import { getAllSkills, findGlobalSkillInstallations } from "@/core/state/global";
import { getAllLocalSkills, findLocalSkillInstallations } from "@/core/state/local";
import { parseKey } from "@/utils/state";
import type { SkillInstallation } from "@/types/state";
import type { InstallableType } from "@/types/skills";
import { resolveInstallationPath } from "@/utils/paths";
import { isValidInstallation } from "@/utils/validation";

export interface TrackedInstallable {
  name: string;
  url: string;
  subpath: string | undefined;
  branch: string;
  commit: string;
  isLocal: boolean;
  installableType: InstallableType;
}

export interface ValidInstallation {
  installation: SkillInstallation;
  resolvedPath: string;
}

export function listTrackedInstallables(cwd?: string): TrackedInstallable[] {
  const result: TrackedInstallable[] = [];
  const seen = new Set<string>();

  const localState = getAllLocalSkills(cwd);
  if (localState) {
    for (const [key, entry] of Object.entries(localState.skills)) {
      const parsed = parseKey(key);
      if (!parsed) continue;

      result.push({
        name: parsed.name,
        url: entry.url,
        subpath: entry.subpath,
        branch: entry.branch,
        commit: entry.commit,
        isLocal: true,
        installableType: parsed.installableType,
      });
      seen.add(key);
    }
  }

  const globalState = getAllSkills();
  for (const [key, entry] of Object.entries(globalState.skills)) {
    if (seen.has(key)) continue;

    const parsed = parseKey(key);
    if (!parsed) continue;

    result.push({
      name: parsed.name,
      url: entry.url,
      subpath: entry.subpath,
      branch: entry.branch,
      commit: entry.commit,
      isLocal: false,
      installableType: parsed.installableType,
    });
  }

  return result;
}

export function getValidInstallations(
  name: string,
  installableType: InstallableType,
  options: { isLocal: boolean; cwd?: string },
): ValidInstallation[] {
  const installations = options.isLocal
    ? findLocalSkillInstallations(name, installableType, options.cwd)
    : findGlobalSkillInstallations(name, installableType);

  return installations
    .map((installation) => ({
      installation,
      resolvedPath: resolveInstallationPath(installation),
    }))
    .filter(({ resolvedPath }) => isValidInstallation(resolvedPath, installableType));
}
