import { program } from "commander";
import { build } from "./build";
import { release } from "./release";
import { version } from "./version";

program
  .name("bun-release-utils")
  .option("-o, --outdir <dir>", "Output directory for binaries, etc.", "dist")
  .option(
    "--changelog <changelog>",
    "Location of changelog file",
    "CHANGELOG.md",
  );

program
  .command("version")
  .description("Publish a new version")
  .argument(
    "<version>",
    "Version number (e.g., 2.3.0) or increment type (major, minor, patch)",
  )
  .action(async function (versionArg: string) {
    const { changelog } = this.parent?.opts()!;
    await version(versionArg, {
      changelog,
    });
  });

program
  .command("build")
  .description("Build single-file executable(s)")
  .option(
    "-t, --target <target>",
    "Specific target to build (e.g., bun-linux-x64)",
  )
  .action(async function ({ target }: { target?: string }) {
    const { outdir } = this.parent?.opts()!;
    await build({ outdir, target });
  });

program
  .command("release")
  .description("Create release in Github")
  .action(async function () {
    const { changelog, outdir } = this.parent?.opts()!;
    await release({ changelog, outdir });
  });

const cmd = await program.parseAsync();
