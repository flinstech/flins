import * as p from "@clack/prompts";
import pc from "picocolors";
import { performInstallation } from "@/services/install";
import { isDirectoryName, resolveSourceFromDirectory, listDirectory } from "@/services/directory";

export interface InstallOptions {
  global?: boolean;
  agent?: string[];
  yes?: boolean;
  force?: boolean;
  silent?: boolean;
  skill?: string[];
  list?: boolean;
  symlink?: boolean;
}

export async function installCommand(source: string, options: InstallOptions) {
  if (!options.silent) {
    p.intro(pc.bgCyan(pc.black(" flins ")));
  }

  try {
    let resolvedSource = source;

    if (isDirectoryName(source)) {
      if (!options.silent) {
        p.log.info(`Looking up "${pc.cyan(source)}" in flins directory...`);
      }
      const directorySource = await resolveSourceFromDirectory(source);

      if (!directorySource) {
        p.log.error(`Skill "${pc.cyan(source)}" not found in directory.`);

        const directory = await listDirectory();
        if (directory.length > 0) {
          p.log.info("Available skills:");
          for (const entry of directory) {
            p.log.message(`  ${pc.cyan(entry.name)} - ${pc.dim(entry.description)}`);
          }
        }
        process.exit(1);
      }

      resolvedSource = directorySource;
    }

    const result = await performInstallation(resolvedSource, options);

    if (!result.success && result.installed === 0 && result.failed === 0) {
      process.exit(1);
    }

    if (result.failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    p.log.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again or check your connection.",
    );
    if (!options.silent) {
      p.outro(pc.red("Installation failed"));
    }
    process.exit(1);
  }
}
