"use server";
import { randomBytes, createHmac } from "crypto";
import base32Encode from "base32-encode";
import { WalletsTable, db } from "@/db/drizzle";
import { sql } from "drizzle-orm";
import { KeyEncodings } from "otplib/core";
import { totp, authenticator } from "otplib";
import base32Decode from "base32-decode";
import { Contract, ethers } from "ethers";
import { Chain } from "viem";
import { sepolia } from "viem/chains";
import { MultisigAbi } from "@/contracts/multisig-abi";

export const getOrGeneratePrivateKey = async (address: string) => {
  const wallet = (
    await db
      .select()
      .from(WalletsTable)
      .where(sql`${WalletsTable.walletAddress} = ${address}`)
  )[0];
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  if (wallet.secret) {
    return wallet.secret;
  }

  const privateKey = authenticator.generateSecret(32);
  const expiration = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
  console.log("Generated secret:", privateKey);
  await db
    .update(WalletsTable)
    .set({
      secret: privateKey,
      secretExpiresAt: new Date(expiration),
    })
    .where(sql`${WalletsTable.walletAddress} = ${address}`)
    .execute();

  return privateKey;
};

export const generateTOTPSecret = async (hexPk: string) => {
  const base32Secret = base32Encode(Buffer.from(hexToBytes(hexPk)), "RFC4648", {
    padding: false,
  });

  return base32Secret;
};

const hexToBytes = (hex: string) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0, c = 0; c < hex.length; i++, c += 2) {
    bytes[i] = parseInt(hex.substr(c, 2), 16);
  }
  return bytes;
};

export const generateTOTP = async (address: string) => {
  const secret = await getOrGeneratePrivateKey(address);
  const issuer = "Multisig 2fa";
  const label = address;
  const otpauth = authenticator.keyuri(label, issuer, secret);
  return otpauth;
};

export const validateOTP = async (otp: string, address: string) => {
  const wallet = (
    await db
      .select()
      .from(WalletsTable)
      .where(sql`${WalletsTable.walletAddress} = ${address}`)
  )[0];
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  if (!wallet.secret) {
    throw new Error("Secret not found");
  }

  const hexSecret = Buffer.from(
    base32Decode(wallet.secret, "RFC4648")
  ).toString("hex");
  totp.options = { encoding: KeyEncodings.HEX };

  const isValid = totp.generate(hexSecret) === otp;
  if (!isValid) {
    return false;
  }
  const atlasAddress = getAddressFromSecret(hexSecret);
  await db
    .update(WalletsTable)
    .set({
      totpValidated: true,
      atlasAddress,
    })
    .where(sql`${WalletsTable.walletAddress} = ${address}`);

  return atlasAddress;
};

const checkOTP = async (otp: string, address: string) => {
  const wallet = (
    await db
      .select()
      .from(WalletsTable)
      .where(sql`${WalletsTable.walletAddress} = ${address}`)
  )[0];
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  if (!wallet.secret) {
    throw new Error("Secret not found");
  }

  const hexSecret = Buffer.from(
    base32Decode(wallet.secret, "RFC4648")
  ).toString("hex");
  totp.options = { encoding: KeyEncodings.HEX };

  const generatedOtp = totp.generate(hexSecret);
  console.log("Generated OTP:", generatedOtp);
  console.log("generatedOtp", generatedOtp, "otp", otp);
  const isValid = generatedOtp === otp;
  if (!isValid) {
    console.log("returning false");
    return false;
  }
  return true;
};

const getAddressFromSecret = (secret: string) => {
  return new ethers.Wallet(secret).address;
};

export const getConfirmAtlasSignature = async (
  otp: string,
  txIndex: number,
  multisigAddress: string,
  chain: number
) => {
  const isValid = await checkOTP(otp, multisigAddress);
  console.log("isValid", isValid);
  if (!isValid) {
    throw new Error("Invalid OTP");
  }
  const wallet = (
    await db
      .select()
      .from(WalletsTable)
      .where(sql`${WalletsTable.walletAddress} = ${multisigAddress}`)
  )[0];
  if (!wallet.secret) {
    throw new Error("Secret not found");
  }
  if (!wallet.atlasAddress) {
    throw new Error("Atlas address not found");
  }
  const hexSecret = Buffer.from(
    base32Decode(wallet.secret, "RFC4648")
  ).toString("hex");
  const provider = new ethers.InfuraProvider(
    chain,
    "b3615957c6b0427eb2fac15afb451acb"
  );
  const signer = new ethers.Wallet(hexSecret, provider);
  const messageHash = ethers.solidityPackedKeccak256(["uint256"], [txIndex]);
  const messageBytes = ethers.getBytes(messageHash);
  const signature = await signer.signMessage(messageBytes);
  return signature;
};
