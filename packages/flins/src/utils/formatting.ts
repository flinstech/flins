import * as p from "@clack/prompts";
import pc from "picocolors";

export function showNoSkillsMessage(): void {
  p.log.warn("No skills yet. Install your first skill:");
  p.log.message(`  ${pc.cyan("npx flins@latest add <repo>")}       # Install in current project`);
  p.log.message(
    `  ${pc.cyan("npx flins@latest add <repo> --global")}  # Install globally for all projects`,
  );
  p.log.message(`  ${pc.dim("Examples:")}`);
  p.log.message(
    `    ${pc.cyan(
      "npx flins@latest add expo",
    )}  # Install from flins directory (https://flins.tech)`,
  );
  p.log.message(`    ${pc.cyan("npx flins@latest search")}            # Browse available skills`);
}

export const Plural = (count: number, singular: string, plural?: string): string => {
  return count === 1 ? singular : (plural ?? `${singular}s`);
};
