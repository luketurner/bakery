import { $ } from "bun";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { getCurrentVersion } from "./util";

function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const parts = version.split(".");
  if (parts.length !== 3) {
    throw new Error(`Invalid version format: ${version}`);
  }

  const [major, minor, patch] = parts.map((p) => {
    const num = parseInt(p, 10);
    if (isNaN(num) || num < 0) {
      throw new Error(`Invalid version number: ${p}`);
    }
    return num;
  });

  return { major: major!, minor: minor!, patch: patch! };
}

function calculateNewVersion(
  currentVersion: string,
  versionInput: string,
): string {
  if (
    versionInput === "major" ||
    versionInput === "minor" ||
    versionInput === "patch"
  ) {
    const { major, minor, patch } = parseVersion(currentVersion);

    switch (versionInput) {
      case "major":
        return `${major + 1}.0.0`;
      case "minor":
        return `${major}.${minor + 1}.0`;
      case "patch":
        return `${major}.${minor}.${patch + 1}`;
    }
  }

  // Validate the provided version
  parseVersion(versionInput);
  return versionInput;
}

function insertChangelogEntry(newVersion: string, changelogPath: string) {
  if (!existsSync(changelogPath)) {
    throw new Error(`${changelogPath} not found`);
  }

  const changelog = readFileSync(changelogPath, "utf-8");
  const lines = changelog.split("\n");

  // Find where to insert the new entry (after the first # Changelog line)
  let insertIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]?.startsWith("# Changelog")) {
      insertIndex = i + 1;
      break;
    }
  }

  if (insertIndex === -1) {
    throw new Error("Could not find '# Changelog' header in changelog.");
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Prepare the new entry
  const newEntry = ["", `## ${newVersion} (${today})`, "", "- ", "", "---"];

  // Insert the new entry
  lines.splice(insertIndex, 0, ...newEntry);

  // Write back to the file
  writeFileSync(changelogPath, lines.join("\n"));
}

export async function version(
  versionInput: string,
  { changelog: changelogPath }: { changelog: string },
): Promise<void> {
  try {
    const currentVersion = getCurrentVersion();
    const newVersion = calculateNewVersion(currentVersion, versionInput);

    console.log(`Current version: ${currentVersion}`);
    console.log(`New version: ${newVersion}`);

    // Insert the changelog template
    insertChangelogEntry(newVersion, changelogPath);
    console.log("Added changelog template");

    // Open editor for user to edit changelog
    const editor = process.env.EDITOR || "vim";

    console.log(`Opening ${changelogPath} in ${editor}...`);

    // Open the editor and wait for it to close
    await $`${editor} ${changelogPath}`;

    // Check if the user actually added content to the changelog
    const changelog = readFileSync(changelogPath, "utf-8");
    if (changelog.includes(`## ${newVersion}`) && changelog.includes("- \n")) {
      console.error(
        "Error: Changelog entry appears to be empty. Please add release notes.",
      );
      process.exit(1);
    }

    console.log("Adding changelog to git...");
    await $`git add ${changelogPath}`;

    console.log(`Creating commit for version ${newVersion}...`);
    await $`git commit -m "update changelog for ${newVersion}"`;

    console.log(`Updating package version to ${newVersion}...`);
    await $`bun pm version ${newVersion}`;

    console.log(`Pushing tag v${newVersion}...`);
    await $`git push origin tag v${newVersion}`;

    console.log("Pushing to main branch...");
    await $`git push origin main`;

    console.log(`✅ Successfully released version ${newVersion}`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
