import type { AgentType } from "./agents";
import type { InstallableType } from "./skills";

export interface SkillInstallation {
  agent: AgentType;
  installableType: InstallableType;
  type: "global" | "project";
  path: string;
}

export interface SkillEntry {
  url: string;
  subpath?: string;
  branch: string;
  commit: string;
}

export interface StateFile {
  lastUpdate: string;
  skills: Record<string, SkillEntry>;
}

export interface LocalState {
  version: string;
  skills: Record<string, SkillEntry>;
}
