import { config } from "dotenv";
import { NFTMetadataInput, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BaseSepoliaTestnet, Sepolia } from "@thirdweb-dev/chains";

config();

// Chain to be used
const chain = Sepolia;

// Contract address of the 1155 to be updated (EditionDrop contract)
const editionContract = "0x2fE3148351871439bEDE81730575d09586d10c37";

// Token ID to be updated
const tokenId = 1;

// New metadata to be set
const newMeta: NFTMetadataInput = {
  description: "My fixed description",
};

const main = async () => {
  if (!process.env.WALLET_PRIVATE_KEY) {
    throw new Error("No private key found");
  }

  try {
    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.WALLET_PRIVATE_KEY,
      chain,
      {
        secretKey: process.env.THIRDWEB_SECRET_KEY,
      }
    );

    console.log("Contract address", editionContract, "on", chain.slug);

    const contract = await sdk.getContract(editionContract);
    const tokenMeta = await contract.erc1155.get(tokenId);
    const { id, uri, ...oldMetadata } = tokenMeta.metadata;
    const newMetadata = {
      ...oldMetadata,
      ...newMeta,
    };
    await contract.erc1155.updateMetadata(tokenId, newMetadata);

    console.log(`Updated token ${tokenId} successfully!`);
  } catch (e) {
    console.error("Something went wrong: ", e);
  }
};

main();
