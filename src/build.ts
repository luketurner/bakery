/**
 * Builds production-ready, single-file executables in ./dist
 */
import { $ } from "bun";
import { mkdir } from "fs/promises";
import { rm } from "fs/promises";
import { getPackageJson } from "./util";

const targets = [
  "bun-linux-x64",
  "bun-linux-arm64",
  "bun-linux-x64-musl",
  "bun-linux-arm64-musl",
  "bun-windows-x64",
  "bun-darwin-x64",
  "bun-darwin-arm64",
];

async function buildTarget(
  target: string,
  { outdir, skipCompress, entrypoint, name }: { outdir: string; skipCompress: boolean; entrypoint: string; name: string; },
) {
  const filename = `${name}-${target.replace("bun-", "")}`;
  console.log(`Building ${target} into ${outdir}/${filename}...`);
  await $`bun build --define RELEASE=true --compile --minify --sourcemap ${entrypoint} --outfile ${outdir}/${filename} --target ${target}`.env(
    {
      NODE_ENV: "production",
    },
  );
  if (skipCompress) return;
  if (target === "bun-windows-x64") {
    await $`chmod u+r ${filename}.exe`.cwd(outdir);
    // since zip doesn't have a --transform equivalent, just use a subdirectory and rename
    await mkdir(`${outdir}/${filename}`);
    await $`cp ${filename}.exe ${filename}/${name}.exe`.cwd(outdir);
    await $`zip -9 ../${filename}.zip ${name}.exe`.cwd(`${outdir}/${filename}`);
    await rm(`${outdir}/${filename}`, { recursive: true });
  } else {
    await $`tar -czf ${filename}.tar.gz --transform='s/${filename}/${name}/' ${filename}`.cwd(
      outdir,
    );
  }
}

export async function build({
  outdir,
  target,
  buildPackage,
  skipCompress,
}: {
  outdir: string;
  target?: string;
  buildPackage: boolean;
  skipCompress: boolean;
}): Promise<void> {

  const packageJson = getPackageJson();

  const entrypoint: string | undefined = getPackageJson().module;
  if (!entrypoint) {
    throw new Error('Must specify module in package.json');
  }

  const name: string | undefined = getPackageJson().name;
  if (!name) {
    throw new Error('Must specify name in package.json');
  }


  await rm(outdir, { recursive: true, force: true });

  if (target && targets.includes(target)) {
    await buildTarget(target, { outdir, skipCompress, entrypoint });
  } else {
    await Promise.all(
      targets.map((target) => buildTarget(target, { outdir, skipCompress, entrypoint, name })),
    );
  }

  if (buildPackage) {
    await $`bun pm pack --filename ${outdir}/${name}-pkg.tar.gz`;
  }
}
