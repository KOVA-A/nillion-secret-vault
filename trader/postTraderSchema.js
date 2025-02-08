import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { orgConfig } from "../nillionOrgConfig.js";
import fs from "fs";

const traderSchema = JSON.parse(
  fs.readFileSync("./trader/traderSchema.json", "utf-8")
);

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    );
    await org.init();

    const traderCollectionName = "Trader Agent Prompt";
    const newTraderSchema = await org.createSchema(
      traderSchema,
      traderCollectionName
    );
    console.log(
      "✅ New Collection Schema created for all nodes:",
      newTraderSchema
    );
    console.log("📈 Trader Schema ID:", newTraderSchema[0].result.data);
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", error.message);
    process.exit(1);
  }
}

main();
