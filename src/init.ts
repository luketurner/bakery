import { $ } from "bun";
import { getPackageJson, updatePackageJson } from "./util";
import { appendFileSync, existsSync, readFileSync } from "fs";

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

const changelogMd = "# Changelog\n\n";

export async function init(options: {
  skipInstall: boolean;
  changelog: string;
  outdir: string;
}) {
  const packageJson = getPackageJson();
  if (!packageJson) {
    throw new Error("Invalid package.json");
  }

  if (
    !options.skipInstall &&
    !(packageJson.dependencies?.bakery || packageJson.devDependencies?.bakery)
  ) {
    await $`bun add --dev git+https://github.com/luketurner/bakery.git`;
  }

  if (!existsSync(".github/workflows/publish.yml")) {
    console.log("Creating .github/workflows/publish.yml...");
    await Bun.write(".github/workflows/publish.yml", actionYaml, {
      createPath: true,
    });
  }

  if (!existsSync(options.changelog)) {
    console.log(`Creating ${options.changelog}`);
    await Bun.write(options.changelog, changelogMd, {
      createPath: true,
    });
  }

  if (existsSync(".gitignore")) {
    if (!readFileSync(".gitignore", "utf-8").includes(options.outdir)) {
      console.log(`Adding ${options.outdir} to gitignore...`);
      appendFileSync(".gitignore", `\n# Bakery\n${options.outdir}\n`);
    }
  } else {
    console.log(`Creating .gitignore with ${options.outdir}...`);
    await Bun.write(".gitignore", `\n# Bakery\n${options.outdir}\n\n`);
  }
}
