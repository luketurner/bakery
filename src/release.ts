import { $ } from "bun";
import { readFile } from "fs/promises";
import { getCurrentVersion } from "./util";

export async function release(options: {
  changelog: string;
  outdir: string;
}): Promise<void> {
  const currentVersion = getCurrentVersion();
  const tag = `v${currentVersion}`;

  console.log(`Creating release for ${tag}...`);

  // check if the release already exists
  const releaseCheck = await $`gh release view ${tag}`.quiet().nothrow();
  const stderr = releaseCheck.stderr.toString();
  if (!stderr.includes("release not found")) {
    if (releaseCheck.exitCode === 1) {
      console.error("unknown error:");
      console.error(stderr);
      process.exit(1);
    }
    console.log("Release already exists!");
    return;
  }

  const notes = (await readFile(options.changelog, "utf-8")).split(
    "\n---\n",
  )[0];

  // release doesn't exist -- create it!
  await $`gh release create ${tag} --verify-tag --notes ${notes} -- ${options.outdir}/*.tar.gz ${options.outdir}/*.zip`;
}
