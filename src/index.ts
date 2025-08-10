import { program } from "commander";

program
  .command("version")
  .description("Publish a new version")
  .action(async () => {
    //TODO
  });

program
  .command("build")
  .description("Build single-file executable(s)")
  .action(async () => {
    //TODO
  });

program
  .command("release")
  .description("Create release in Github")
  .action(async () => {
    //TODO
  });

program.parseAsync();
