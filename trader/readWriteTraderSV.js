import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { v4 as uuidv4 } from "uuid";
import { orgConfig } from "../nillionOrgConfig.js";
import "dotenv/config.js";

const TRADER_SCHEMA_ID = process.env.TRADER_SCHEMA_ID;

const traderData = [
  {
    strategy: {
      $allot:
        "Buy the coin with third highest volume (7 days) for exactly 1 USDT.",
    }, // strategy will be encrypted to a $share
  },
];

async function storeTraderData() {
  // Trader schema
  try {
    // Create a secret vault wrapper and initialize the SecretVault collection to use
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      TRADER_SCHEMA_ID
    );
    await collection.init();

    // Write collection data to nodes encrypting the specified fields ahead of time
    const dataWritten = await collection.writeToNodes(traderData);
    console.log(
      "👀 Trader Data written to nodes:",
      JSON.stringify(dataWritten, null, 2)
    );

    // Get the ids of the SecretVault records created
    const newIds = [
      ...new Set(dataWritten.map((item) => item.result.data.created).flat()),
    ];
    console.log("uploaded record ids:", newIds);

    // Read all collection data from the nodes, decrypting the specified fields
    const decryptedCollectionData = await collection.readFromNodes({});

    // Log first 5 records
    console.log(
      "Most recent records",
      decryptedCollectionData.slice(0, traderData.length)
    );
  } catch (error) {
    console.error("❌ SecretVaultWrapper error:", error.message);
    process.exit(1);
  }
}

async function main() {
  await storeTraderData();
}

main();
