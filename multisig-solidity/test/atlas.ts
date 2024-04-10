import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";

describe("MultiSigWallet", function () {
  let MultiSigWallet: Contract;
  let wallet: Contract;
  let owner1: Signer, owner2: Signer, owner3: Signer, nonOwner: Signer;

  beforeEach(async function () {
    [owner1, owner2, owner3, nonOwner] = await ethers.getSigners();
    const MultiSigWalletFactory = await ethers.getContractFactory(
      "MultiSigWallet"
    );

    wallet = await MultiSigWalletFactory.deploy(
      [
        await owner1.getAddress(),
        await owner2.getAddress(),
        await owner3.getAddress(),
      ],
      2
    );

    // No need to call .deployed() here; it's already awaited and deployed.
    // If you want to ensure it's deployed, you could include:
    await wallet;
  });

  describe("it should generate atlas", async function () {
    await wallet
      .connect(owner1)
      .proposeAtlasActivation(await owner3.getAddress());
    let proposedTime = await wallet.atlasProposedActivationTime();

    // Ensure atlasProposedActivationAddress is set correctly
    expect(await wallet.atlasProposedActivationAddress()).to.equal(
      await owner3.getAddress()
    );

    // Simulate passing of time
    const atlasChangeMinTime = 3600; // Assuming 1 hour minimum time; adjust according to your contract
    await ethers.provider.send("evm_increaseTime", [atlasChangeMinTime + 1]); // Increase EVM time by 1 hour + 1 second
    await ethers.provider.send("evm_mine", []); // Mine a new block for the time change to take effect

    // Activate Atlas
    await wallet.connect(owner1).activateAtlas();

    // Validate activation
    expect(await wallet.atlasAddress()).to.equal(await owner3.getAddress());

    // Ensure reset of proposal state
    expect(await wallet.atlasProposedActivationAddress()).to.equal(
      ethers.constants.AddressZero
    );
    expect(await wallet.atlasProposedActivationTime()).to.be.equal(0);
  });
});
