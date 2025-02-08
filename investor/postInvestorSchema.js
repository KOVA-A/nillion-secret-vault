import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { orgConfig } from '../nillionOrgConfig.js';
import fs from 'fs';
// import investorSchema from './investorSchema.json' assert { type: 'json' };

const investorSchema = JSON.parse(fs.readFileSync('./investor/investorSchema.json', 'utf-8'));

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    );
    await org.init();

    // Create a new collection schema for all nodes in the org
    const investorCollectionName = 'Investor Agent Prompt';
    const newInvestorSchema = await org.createSchema(investorSchema, investorCollectionName);
    console.log('✅ New Collection Schema created for all nodes:', newInvestorSchema);
    console.log('👨‍💼 Investor Schema ID:', newInvestorSchema[0].result.data);

  } catch (error) {
    console.error('❌ Failed to use SecretVaultWrapper:', error.message);
    process.exit(1);
  }
}

main();