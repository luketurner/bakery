import { readFileSync } from "fs";

export function getCurrentVersion() {
  const currentVersion = JSON.parse(
    readFileSync("package.json", "utf-8"),
  )?.version;
  if (!currentVersion) {
    throw new Error("Must specify version in package.json");
  }
  return currentVersion;
}
