import * as p from "@clack/prompts";
import pc from "picocolors";
import { listDirectory, type DirectoryEntry } from "@/services/directory";
import { track } from "@/services/telemetry";

export async function searchCommand() {
  p.intro(pc.bgCyan(pc.black(" flins ")));

  try {
    const spinner = p.spinner();

    spinner.start("Browsing skills...");
    const entries = await listDirectory();
    spinner.stop("Directory loaded");

    if (entries.length === 0) {
      p.log.warn("Directory is empty");
      p.outro("New skills coming soon");
      return;
    }

    const selected = await p.autocompleteMultiselect({
      message: "Find a skill:",
      options: entries.map((entry) => ({
        value: entry.name,
        label: entry.name,
        hint: `${entry.author} - ${entry.description.slice(0, 50)}${entry.description.length > 50 ? "..." : ""}`,
      })),
      placeholder: "Type to search...",
    });

    if (p.isCancel(selected)) {
      p.cancel("Search cancelled");
      return;
    }

    const selectedName = Array.isArray(selected) && selected.length > 0 ? selected[0] : selected;
    if (!selectedName) {
      p.cancel("No selection made");
      return;
    }

    const entry = entries.find((e) => e.name === selectedName);
    if (!entry) return;

    showEntryDetails(entry);

    const install = await p.confirm({
      message: "Add this skill?",
    });

    if (p.isCancel(install) || !install) {
      track({ command: "search", name: selectedName as string });
      p.outro("Install anytime with " + pc.green(`flins add ${entry.name}`));
      return;
    }

    track({ command: "search", name: selectedName as string });

    const { installCommand } = await import("@/cli/commands/install");
    await installCommand(entry.name, {});
  } catch (error) {
    p.log.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again or check your connection.",
    );
    p.outro(pc.red("Couldn't load skill directory"));
    process.exit(1);
  }
}

function showEntryDetails(entry: DirectoryEntry) {
  p.log.step(pc.bold("Skill Details"));

  p.log.message(`${pc.cyan(entry.name)}`);
  p.log.message(`  ${pc.dim(entry.description)}`);

  if (entry.tags.length > 0) {
    p.log.message(`  ${pc.bold("Tags:")} ${entry.tags.map((t) => pc.green(t)).join(", ")}`);
  }

  p.log.message(`  ${pc.bold("Author:")} ${pc.yellow(entry.author)}`);
  p.log.message(`  ${pc.bold("Source:")} ${pc.dim(entry.source)}`);
  p.log.message(`  ${pc.dim("Install with:")} ${pc.green(`flins add ${entry.name}`)}`);
}
