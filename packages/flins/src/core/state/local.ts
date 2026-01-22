import { createLocalStore } from "./store";
import type { LocalState, SkillEntry, SkillInstallation } from "@/types/state";
import type { InstallableType } from "@/types/skills";

export function loadLocalState(cwd?: string): LocalState | null {
  return createLocalStore(cwd).load() as LocalState | null;
}

export function saveLocalState(state: LocalState, cwd?: string): void {
  createLocalStore(cwd).save(state);
}

export function addLocalSkill(
  skillName: string,
  url: string,
  subpath: string | undefined,
  branch: string,
  commit: string,
  installableType: InstallableType,
  cwd?: string,
): { updated: boolean; previousBranch?: string } {
  return createLocalStore(cwd).addSkill({
    name: skillName,
    url,
    subpath,
    branch,
    commit,
    installableType,
  });
}

export function removeLocalSkill(
  skillName: string,
  installableType: InstallableType,
  cwd?: string,
): void {
  createLocalStore(cwd).removeSkill(skillName, installableType);
}

export function updateLocalSkillCommit(
  skillName: string,
  installableType: InstallableType,
  commit: string,
  cwd?: string,
): void {
  createLocalStore(cwd).updateCommit(skillName, installableType, commit);
}

export function getLocalSkill(
  skillName: string,
  installableType: InstallableType,
  cwd?: string,
): SkillEntry | null {
  return createLocalStore(cwd).getEntry(skillName, installableType);
}

export function getAllLocalSkills(cwd?: string): LocalState | null {
  return createLocalStore(cwd).getAll() as LocalState | null;
}

export function findLocalSkillInstallations(
  skillName: string,
  installableType: InstallableType,
  cwd?: string,
): SkillInstallation[] {
  return createLocalStore(cwd).findInstallations(skillName, installableType);
}

export async function cleanOrphanedEntries(cwd?: string): Promise<void> {
  return createLocalStore(cwd).cleanOrphanedEntries();
}
