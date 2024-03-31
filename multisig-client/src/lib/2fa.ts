"use server";
import { randomBytes, createHmac } from "crypto";
import base32Encode from "base32-encode";
import { WalletsTable, db } from "@/db/drizzle";
import { sql } from "drizzle-orm";
import { totp } from "otplib";

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

  const privateKey = randomBytes(20).toString("hex");
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
  const totp = await generateTOTPSecret(secret);
  const issuer = "Multisig 2fa";
  const label = address;
  const algorithm = "SHA1";

  return `otpauth://totp/${issuer}:${label}?secret=${totp}&issuer=${issuer}&algorithm=${algorithm}&digits=6&period=30`;
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

  return totp.check(otp, wallet.secret);
};
