import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { v4 as uuidv4 } from "uuid";
import { orgConfig } from "../nillionOrgConfig.js";
import "dotenv/config.js";

const INVESTOR_SCHEMA_ID = process.env.INVESTOR_SCHEMA_ID;

const investorData = [
  {
    constraints: {
      $allot: "maximum investment per trade: 0.5 USDT",
    }, // strategy will be encrypted to a $share
  },
];

async function storeInvestorData() {
  // Investor schema
  try {
    // Create a secret vault wrapper and initialize the SecretVault collection to use
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      INVESTOR_SCHEMA_ID
    );
    await collection.init();

    // Write collection data to nodes encrypting the specified fields ahead of time
    const dataWritten = await collection.writeToNodes(investorData);
    console.log(
      "👀 Investor Data written to nodes:",
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
      decryptedCollectionData.slice(0, investorData.length)
    );
  } catch (error) {
    console.error("❌ SecretVaultWrapper error:", error.message);
    process.exit(1);
  }
}

async function main() {
  await storeInvestorData();
}

main();
