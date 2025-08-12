import { program } from "commander";
import { build } from "./build";
import { release } from "./release";
import { version } from "./version";
import { init } from "./init";

program
  .name("bakery")
  .option("-o, --outdir <dir>", "Output directory for binaries, etc.", "dist")
  .option(
    "--changelog <changelog>",
    "Location of changelog file",
    "CHANGELOG.md"
  );

program
  .command("init")
  .description("Set up project")
  .option("--skip-install", "Skip automatic bakery installation", false)

  .action(async function ({ skipInstall }: { skipInstall: boolean }) {
    const { changelog } = this.parent?.opts()!;
    await init({ skipInstall, changelog });
  });

program
  .command("version")
  .description("Publish a new version")
  .argument(
    "<version>",
    "Version number (e.g., 2.3.0) or increment type (major, minor, patch)"
  )
  .option("-p, --push", "Push tag and branch to origin remote", false)
  .option("-r, --remote <remote>", "Which remote to push to", "origin")
  .option(
    "-e, --editor <editor>",
    "Editor to use (e.g. vim). If not set, the EDITOR variable will be used. If that's not set either, defaults to vim.",
    undefined
  )
  .action(async function (
    versionArg: string,
    {
      push,
      remote,
      editor,
    }: { push: boolean; remote: string; editor: string | undefined }
  ) {
    const { changelog } = this.parent?.opts()!;
    await version(versionArg, {
      changelog,
      push,
      remote,
      editor,
    });
  });

program
  .command("build")
  .description("Build single-file executable(s)")
  .option(
    "-t, --target <target>",
    "Specific target to build (e.g., bun-linux-x64)"
  )
  .option(
    "-p, --build-package",
    "Builds an npm tarball in addition to single-file binaries",
    false
  )
  .option(
    "--skip-compress",
    "Skips creating compressed archives (*.tar.gz and *.zip)",
    false
  )
  .action(async function ({
    target,
    buildPackage,
    skipCompress,
  }: {
    target?: string;
    buildPackage: boolean;
    skipCompress: boolean;
  }) {
    const { outdir } = this.parent?.opts()!;
    await build({ outdir, target, buildPackage, skipCompress });
  });

program
  .command("release")
  .description("Create release in Github")
  .action(async function () {
    const { changelog, outdir } = this.parent?.opts()!;
    await release({ changelog, outdir });
  });

const cmd = await program.parseAsync();
