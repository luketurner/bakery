import { readFileSync, writeFileSync } from "fs";

export function getPackageJson() {
  return JSON.parse(readFileSync("package.json", "utf-8"));
}

export function updatePackageJson(newJson: any) {
  return writeFileSync(
    "package.json",
    JSON.stringify(newJson, null, 2) + "\n",
    "utf-8",
  );
}

export function getPackageName({ includeScope = true }: { includeScope?: boolean } = { includeScope: true }): string {
  const name = getPackageJson()?.name;
  if (!name) {
    throw new Error("Must specify name in package.json");
  }
  if (!includeScope && name.startsWith('@')) {
    return name.replace(/^@[^/]+\//, '');
  }
  return name;
}

export function getCurrentVersion(): string {
  const currentVersion = getPackageJson()?.version;
  if (!currentVersion) {
    throw new Error("Must specify version in package.json");
  }
  return currentVersion;
}
