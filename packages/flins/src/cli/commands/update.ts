import * as p from "@clack/prompts";
import pc from "picocolors";
import { performUpdate } from "@/services/update";
import { track } from "@/services/telemetry";

export interface UpdateOptions {
  yes?: boolean;
  force?: boolean;
  silent?: boolean;
}

export async function updateCommand(skills: string[], options: UpdateOptions) {
  if (!options.silent) {
    p.intro(pc.bgCyan(pc.black(" flins ")));
  }

  try {
    const results = await performUpdate(skills.length > 0 ? skills : undefined, options);

    for (const r of results) {
      track({
        command: "update",
        name: r.skillName,
        success: r.success && r.updated > 0,
      });
    }
  } catch (error) {
    p.log.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again or check your connection.",
    );
    if (!options.silent) {
      p.outro(pc.red("Update failed"));
    }
    process.exit(1);
  }
}
