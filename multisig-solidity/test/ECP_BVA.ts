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

  describe("submitTransaction", function () {
    it("Should allow an owner to submit a transaction", async function () {
      await expect(
        wallet.submitTransaction(
          await nonOwner.getAddress(),
          ethers.parseEther("1"),
          "0x"
        )
      ).to.emit(wallet, "SubmitTransaction");
    });

    it("Should reject submission from non-owner", async function () {
      await expect(
        wallet
          .connect(nonOwner)
          .submitTransaction(
            nonOwner.getAddress(),
            ethers.parseEther("1"),
            "0x"
          )
      ).to.be.revertedWith("not owner");
    });
  });

  describe("confirmTransaction", function () {
    it("Should allow an owner to confirm a transaction", async function () {
      await wallet.submitTransaction(
        nonOwner.getAddress(),
        ethers.parseEther("1"),
        "0x"
      );
      await expect(wallet.confirmTransaction(0)).to.emit(
        wallet,
        "ConfirmTransaction"
      );
    });

    it("Should reject confirmations for non-existent transactions", async function () {
      await expect(wallet.confirmTransaction(0)).to.be.revertedWith(
        "tx does not exist"
      );
    });
  });

  describe("executeTransaction", function () {
    beforeEach(async function () {
      await wallet.submitTransaction(nonOwner.getAddress(), 0, "0x");
      await wallet.confirmTransaction(0);
    });

    it("Should execute a transaction after required confirmations", async function () {
      await wallet.connect(owner2).confirmTransaction(0);
      await expect(wallet.executeTransaction(0)).to.emit(
        wallet,
        "ExecuteTransaction"
      );
    });

    it("Should not execute a transaction without required confirmations", async function () {
      await expect(wallet.executeTransaction(0)).to.be.revertedWith(
        "cannot execute tx"
      );
    });
  });

  describe("revokeConfirmation", function () {
    beforeEach(async function () {
      await wallet.submitTransaction(nonOwner.getAddress(), 0, "0x");
      await wallet.confirmTransaction(0);
    });

    it("Should allow an owner to revoke their confirmation", async function () {
      await expect(wallet.revokeConfirmation(0)).to.emit(
        wallet,
        "RevokeConfirmation"
      );
    });

    it("Should prevent revoking a confirmation if not confirmed", async function () {
      await expect(
        wallet.connect(owner2).revokeConfirmation(0)
      ).to.be.revertedWith("tx not confirmed");
    });
  });
});
