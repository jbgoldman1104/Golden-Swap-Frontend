// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const contractFactory = await ethers.getContractFactory("LemonSwap");
  const contract = await contractFactory.deploy();

  await contract.deployed();

  console.log("Lemonswap deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// TestNET
// 0xa695c1941F071327065e3B08C61969A3305E2F7e

// MainNet
// 0xA150f39988a3AA68FF287E8260A97510262ED0fa