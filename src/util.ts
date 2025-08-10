import { readFileSync, writeFileSync } from "fs";

export function getPackageJson() {
  return JSON.parse(readFileSync("package.json", "utf-8"));
}

export function updatePackageJson(newJson: any) {
  return writeFileSync("package.json", JSON.stringify(newJson, null, 2) + "\n", "utf-8");
}

export function getCurrentVersion() {
  const currentVersion = getPackageJson()?.version;
  if (!currentVersion) {
    throw new Error("Must specify version in package.json");
  }
  return currentVersion;
}
