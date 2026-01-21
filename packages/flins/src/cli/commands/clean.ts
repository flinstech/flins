import * as p from "@clack/prompts";
import pc from "picocolors";
import { cleanOrphaned } from "@/services/update";

export interface CleanOptions {
  yes?: boolean;
  force?: boolean;
  silent?: boolean;
}

export async function cleanCommand(options: CleanOptions = {}) {
  if (!options.silent) {
    p.intro(pc.bgCyan(pc.black(" flins ")));
  }

  try {
    await cleanOrphaned(options);
    if (!options.silent) {
      p.outro(pc.green("State cleaned up"));
    }
  } catch (error) {
    p.log.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again or check your connection.",
    );
    if (!options.silent) {
      p.outro(pc.red("Failed to clean up"));
    }
    process.exit(1);
  }
}
