import { $ } from "bun";
import { getCurrentVersion, getPackageName } from "./util";

export interface PublishOptions {
  access?: "public" | "restricted";
}

async function isVersionPublished(
  packageName: string,
  version: string,
): Promise<boolean> {
  try {
    const result = await $`npm view ${packageName}@${version} version`.quiet();
    return result.text().trim() === version;
  } catch (error) {
    // If npm view fails, the version doesn't exist
    return false;
  }
}

export async function publish(options: PublishOptions) {
  const { access } = options;

  const packageName = getPackageName();
  const currentVersion = getCurrentVersion();

  if (await isVersionPublished(packageName, currentVersion)) {
    console.log(`⚠️ ${packageName}@${currentVersion} already published.`);
    return;
  }

  try {
    if (access) {
      await $`npm publish --access ${access}`;
    } else {
      await $`npm publish`;
    }
    console.log(`✅ ${packageName}@${currentVersion} published successfully`);
  } catch (error) {
    console.error(`❌ Failed to publish ${packageName}@${currentVersion}`);
    console.error(error);
    process.exit(1);
  }
}
