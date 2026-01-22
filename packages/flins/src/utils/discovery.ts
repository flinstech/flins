export const SKIP_DIRS = ["node_modules", ".git", "dist", "build", "__pycache__"];

export function shouldSkipDirectory(name: string): boolean {
  return SKIP_DIRS.includes(name);
}
