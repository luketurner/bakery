import { $ } from "bun";
import { getPackageJson, updatePackageJson } from "./util";
import { existsSync, writeFileSync } from "fs";

const actionYaml = `
name: publish-release
run-name: Publish Release
on:
  push:
    branches: ["main"]
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - uses: actions/checkout@v4
      - run: "bun ci"
      - run: "bun run bakery build"
      - run: "bun run bakery release"
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;

export async function init(options: { skipInstall: boolean }) {
  if (!options.skipInstall) {
    await $`bun add git+https://github.com/luketurner/bakery.git`;
  }
  const packageJson = getPackageJson();
  if (!packageJson) {
    throw new Error("Invalid package.json");
  }
  if (packageJson.scripts?.bakery) {
    return;
  }
  console.log("Adding bakery command to package.json...");
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  packageJson.scripts.bakery = "bakery";
  updatePackageJson(packageJson);

  if (!existsSync(".github/workflows/publish.yml")) {
    console.log("Creating github workflow...");
    writeFileSync(".github/workflows/publish.yml", actionYaml, "utf-8");
  }
}
