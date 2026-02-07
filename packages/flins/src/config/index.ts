import { existsSync } from "fs";
import type { AgentConfig, AgentType } from "@/types/agents";
import { expandHomeDir } from "@/utils/paths";
import agentsConfig from "./agents.json" with { type: "json" };

interface AgentConfigEntry {
  name: string;
  displayName: string;
  skillsDir: string;
  globalSkillsDir: string;
  commandsDir?: string;
  globalCommandsDir?: string;
  installDir: string;
}

export const DIRECTORY_URL = process.env.DIRECTORY_URL || "https://flins.tech/directory.json";

export function loadAgentConfig(): Record<AgentType, AgentConfig> {
  const config = {} as Record<AgentType, AgentConfig>;
  const agentsConfigTyped = agentsConfig as Record<string, AgentConfigEntry>;

  for (const [type, agent] of Object.entries(agentsConfigTyped)) {
    const agentType = type as AgentType;

    config[agentType] = {
      name: agent.name,
      displayName: agent.displayName,
      skillsDir: agent.skillsDir,
      globalSkillsDir: expandHomeDir(agent.globalSkillsDir),
      commandsDir: agent.commandsDir,
      globalCommandsDir: agent.globalCommandsDir
        ? expandHomeDir(agent.globalCommandsDir)
        : undefined,
      installDir: expandHomeDir(agent.installDir),
      detectInstalled: async () => {
        const installPath = expandHomeDir(agent.installDir);
        return existsSync(installPath);
      },
    };
  }

  return config;
}

export const agents = loadAgentConfig();
