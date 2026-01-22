import { platform, arch } from "node:os";
import { spawn } from "node:child_process";
import packageJson from "../../package.json" with { type: "json" };

const TELEMETRY_URL = "https://tidy-oriole-956.convex.site/telemetry";
const CLI_VERSION = packageJson.version;

const IS_CI = Boolean(
  process.env.CI ||
  process.env.CONTINUOUS_INTEGRATION ||
  process.env.GITHUB_ACTIONS ||
  process.env.GITLAB_CI ||
  process.env.TRAVIS ||
  process.env.JENKINS_URL ||
  process.env.BITBUCKET_BUILD_NUMBER ||
  process.env.CODEBUILD_BUILD_ID,
);

const ENABLED = !IS_CI && process.env.FLINS_TELEMETRY !== "0" && process.env.NODE_ENV !== "test";

type Command = "add" | "update" | "remove" | "list" | "search" | "outdated" | "clean";

export interface TelemetryEvent {
  command: Command;
  type?: "skill" | "command";
  repo?: string;
  sourceUrl?: string;
  name?: string;
  agent?: string;
  scope?: "global" | "project";
  success?: boolean;
}

interface TelemetryPayload extends TelemetryEvent {
  timestamp: number;
  osPlatform: string;
  osArch: string;
  nodeVersion: string;
  cliVersion: string;
}

let pendingEvents: TelemetryPayload[] = [];

function extractRepoWithPath(source: string): string {
  const githubMatch = source.match(
    /github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?(?:\/tree\/[^/]+\/(.+?))?(?:\/)?(?:[#]|$)/i,
  );
  if (githubMatch) {
    const repo = githubMatch[1]!;
    const subpath = githubMatch[2];
    return subpath ? `${repo}/${subpath}` : repo;
  }

  const gitlabMatch = source.match(
    /gitlab\.com[/:]([^/]+\/[^/]+?)(?:\.git)?(?:\/-\/tree\/[^/]+\/(.+?))?(?:\/)?(?:[#]|$)/i,
  );
  if (gitlabMatch) {
    const repo = gitlabMatch[1]!;
    const subpath = gitlabMatch[2];
    return subpath ? `${repo}/${subpath}` : repo;
  }

  const shorthandMatch = source.match(/^([^/]+\/[^/]+?)(?:\/(.+?))?(?:\/)?$/);
  if (shorthandMatch) {
    const repo = shorthandMatch[1]!;
    const subpath = shorthandMatch[2];
    return subpath ? `${repo}/${subpath}` : repo;
  }

  return source.replace(/\.git$/, "").replace(/\/$/, "");
}

export function track(event: TelemetryEvent): void {
  if (!ENABLED) return;

  pendingEvents.push({
    ...event,
    repo: event.repo ? extractRepoWithPath(event.repo) : undefined,
    timestamp: Date.now(),
    osPlatform: platform(),
    osArch: arch(),
    nodeVersion: process.version,
    cliVersion: CLI_VERSION,
  });
}

export function flushSync(): void {
  if (!ENABLED || pendingEvents.length === 0) return;

  const events = pendingEvents;
  pendingEvents = [];

  const body = JSON.stringify(events);

  const child = spawn(
    "curl",
    [
      "-s",
      "-X",
      "POST",
      TELEMETRY_URL,
      "-H",
      "Content-Type: application/json",
      "-d",
      body,
      "--max-time",
      "10",
    ],
    {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    },
  );

  child.unref();
}
