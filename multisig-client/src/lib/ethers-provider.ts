import { ethers } from "ethers";

const ethersProvider = new ethers.providers.JsonRpcProvider(
  process.env.RPC_URL
);
