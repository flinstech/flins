import { resolve, join } from "path";
import { homedir } from "os";
import type { SkillInstallation } from "@/types/state";

const FLINS_HOME = ".flins";
const AGENTS_SOURCE_DIR = ".agents";
const SKILLS_DIR = "skills";
const COMMANDS_DIR = "commands";

export function expandHomeDir(path: string): string {
  if (path.startsWith("~")) {
    return path.replace("~", homedir());
  }
  return path;
}

export function resolveInstallationPath(installation: SkillInstallation): string {
  return installation.type === "global"
    ? expandHomeDir(installation.path)
    : resolve(process.cwd(), installation.path);
}

export function getFlinsHomeDir(): string {
  return join(homedir(), FLINS_HOME);
}

export function getAgentsSourceDir(options: { global?: boolean; cwd?: string } = {}): string {
  if (options.global) {
    return join(getFlinsHomeDir(), AGENTS_SOURCE_DIR);
  }
  return join(options.cwd || process.cwd(), AGENTS_SOURCE_DIR);
}

export function getSkillsSourceDir(options: { global?: boolean; cwd?: string } = {}): string {
  return join(getAgentsSourceDir(options), SKILLS_DIR);
}

export function getCommandsSourceDir(options: { global?: boolean; cwd?: string } = {}): string {
  return join(getAgentsSourceDir(options), COMMANDS_DIR);
}
