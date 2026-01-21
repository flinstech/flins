import * as p from "@clack/prompts";
import pc from "picocolors";
import { performRemove } from "@/services/remove";
import { track } from "@/services/telemetry";

export interface RemoveOptions {
  yes?: boolean;
  force?: boolean;
  silent?: boolean;
}

export async function removeCommand(skills: string[], options: RemoveOptions) {
  if (!options.silent) {
    p.intro(pc.bgCyan(pc.black(" flins ")));
  }

  try {
    const results = await performRemove(skills, options);

    for (const r of results) {
      track({
        command: "remove",
        name: r.skillName,
        success: r.success && r.removed > 0,
      });
    }
  } catch (error) {
    p.log.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again or check your connection.",
    );
    if (!options.silent) {
      p.outro(pc.red("Failed to remove skills"));
    }
    process.exit(1);
  }
}
