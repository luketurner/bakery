import { program } from "commander";
import { build } from "./build";
import { release } from "./release";
import { version } from "./version";

program
  .command("version")
  .description("Publish a new version")
  .argument(
    "<version>",
    "Version number (e.g., 2.3.0) or increment type (major, minor, patch)",
  )
  .action(async (versionArg: string) => {
    await version(versionArg);
  });

program
  .command("build")
  .description("Build single-file executable(s)")
  .option(
    "-t, --target <target>",
    "Specific target to build (e.g., bun-linux-x64)",
  )
  .action(async (options: { target?: string }) => {
    await build(options.target);
  });

program
  .command("release")
  .description("Create release in Github")
  .action(async () => {
    await release();
  });

program.parseAsync();
