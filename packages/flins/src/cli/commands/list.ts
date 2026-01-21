import * as p from "@clack/prompts";
import pc from "picocolors";
import { listRemovableSkills } from "@/services/remove";
import { track } from "@/services/telemetry";

export async function listCommand() {
  p.intro(pc.bgCyan(pc.black(" flins ")));

  try {
    await listRemovableSkills();

    track({ command: "list" });

    p.outro(pc.green("Showing all installed skills"));
  } catch (error) {
    p.log.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again or check your connection.",
    );
    p.outro(pc.red("Failed to load skills"));
    process.exit(1);
  }
}
