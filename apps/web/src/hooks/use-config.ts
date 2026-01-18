import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Config = {
  packageManager: "flins" | "npm" | "yarn" | "pnpm" | "bun";
  installationType: "cli" | "manual";
};

const configAtom = atomWithStorage<Config>("config", {
  installationType: "cli",
  packageManager: "flins",
});

export function useConfig() {
  return useAtom(configAtom);
}
