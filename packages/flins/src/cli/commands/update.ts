import * as p from "@clack/prompts";
import pc from "picocolors";
import { performUpdate } from "@/services/update";

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
    await performUpdate(skills.length > 0 ? skills : undefined, options);
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
