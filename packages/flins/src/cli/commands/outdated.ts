import * as p from "@clack/prompts";
import pc from "picocolors";
import { checkStatus, displayStatus } from "@/services/update";
import { track } from "@/services/telemetry";

export interface OutdatedOptions {
  verbose?: boolean;
  silent?: boolean;
}

export async function outdatedCommand(skills: string[], options: OutdatedOptions = {}) {
  if (!options.silent) {
    p.intro(pc.bgCyan(pc.black(" flins ")));
  }

  try {
    const results = await checkStatus(skills.length > 0 ? skills : undefined);
    const verbose = options.verbose || skills.length > 0;
    await displayStatus(results, verbose);

    track({ command: "outdated" });

    if (!options.silent) {
      p.outro(pc.green("Done"));
    }
  } catch (error) {
    p.log.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again or check your connection.",
    );
    if (!options.silent) {
      p.outro(pc.red("Failed to check for updates"));
    }
    process.exit(1);
  }
}
