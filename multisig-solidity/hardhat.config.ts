import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/b3615957c6b0427eb2fac15afb451acb",
      accounts: [
        "0x15af258ae44a23f7ef4027851099b104e6b5b9d450c249c0ac3d2fd8892548c0", // delfinu
      ],
    },
  },
};

export default config;
