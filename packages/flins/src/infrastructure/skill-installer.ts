import { join } from "path";
import { agents } from "@/core/agents/config";
import { installSkillFiles, installSkillAsSymlink, checkSkillInstalled } from "./file-system";
import { resolveAgentSkillsDir } from "@/utils/paths";
import type { Skill } from "@/types/skills";
import type { AgentType } from "@/types/agents";

export async function installSkillForAgent(
  skill: Skill,
  agent: AgentType,
  options: { global: boolean; symlink?: boolean },
): Promise<{ success: boolean; path: string; originalPath: string; error?: string }> {
  const agentConfig = agents[agent];
  const baseDir = resolveAgentSkillsDir(
    options.global ? agentConfig.globalSkillsDir : agentConfig.skillsDir,
    { global: options.global },
  );
  const targetPath = join(baseDir, skill.name);

  const result = options.symlink
    ? await installSkillAsSymlink(skill.path, skill.name, targetPath, {
        global: options.global,
      })
    : await installSkillFiles(skill.path, targetPath);

  return {
    ...result,
    originalPath: skill.path,
  };
}

export async function isSkillInstalled(
  skillName: string,
  agent: AgentType,
  options: { global: boolean },
): Promise<boolean> {
  const path = getInstallPath(skillName, agent, options);
  return checkSkillInstalled(path);
}

export function getInstallPath(
  skillName: string,
  agent: AgentType,
  options: { global: boolean },
): string {
  const agentConfig = agents[agent];
  const baseDir = resolveAgentSkillsDir(
    options.global ? agentConfig.globalSkillsDir : agentConfig.skillsDir,
    { global: options.global },
  );
  return join(baseDir, skillName);
}
