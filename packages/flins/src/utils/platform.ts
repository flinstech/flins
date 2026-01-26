import { platform, homedir } from "os";

export function isWindows(): boolean {
  return platform() === "win32";
}

export function getSymlinkType(isDirectory: boolean): "dir" | "file" | "junction" | undefined {
  if (!isWindows()) {
    return undefined;
  }

  return isDirectory ? "junction" : "file";
}

export function getHomeDir(): string {
  return homedir();
}

export interface FsError extends Error {
  code?: string;
  path?: string;
  syscall?: string;
  errno?: number;
}

export function getErrorGuidance(error: Error): string {
  const fsError = error as FsError;

  switch (fsError.code) {
    case "EACCES":
      return "Permission denied. Run as administrator or check file permissions.";
    case "EPERM":
      return "Operation not permitted. Check file system permissions.";
    case "EROFS":
      return "Read-only file system. Cannot write to this location.";
    case "ENOSPC":
      return "No space left on device. Free up disk space and try again.";
    case "EBUSY":
      return "Resource busy. The file is in use by another process.";
    case "ENOENT":
      return "File or directory not found.";
    case "ENOTDIR":
      return "Not a directory. Expected a directory path.";
    case "ELOOP":
      return "Too many levels of symbolic links. Circular link detected.";
    case "EXDEV":
      return "Invalid cross-device link. Source and destination are on different filesystems.";
    default:
      return fsError.message || "Unknown error occurred.";
  }
}
