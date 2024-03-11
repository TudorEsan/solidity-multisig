import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const token = await (
    await ethers.getContractFactory("Multisig")
  ).deploy(
    [
      "0xc0f8D93BFA45C92A3DD2fb34A283887284c42412",
      "0x5cb0DD5dA8c8af5cc03943b5b7cd7Dbd29207E43",
    ],
    1
  );
  console.log("Token address:", token.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
