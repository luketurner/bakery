import { execSync } from "child_process";

export interface PublishOptions {
  access?: "public" | "restricted";
}

export async function publish(options: PublishOptions) {
  const { access } = options;

  const args = ["npm", "publish"];
  
  if (access) {
    args.push("--access", access);
  }

  const command = args.join(" ");
  
  console.log(`Running: ${command}`);
  
  try {
    execSync(command, { stdio: "inherit" });
    console.log("✅ Package published successfully");
  } catch (error) {
    console.error("❌ Failed to publish package");
    process.exit(1);
  }
}