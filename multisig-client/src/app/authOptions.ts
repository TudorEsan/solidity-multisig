import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          placeholder: "0x0",
          type: "text",
        },
        signature: {
          label: "Signature",
          placeholder: "0x0",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl =
            process.env.NEXTAUTH_URL ||
            (process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : null);
          if (!nextAuthUrl) {
            console.error("NEXTAUTH_URL or VERCEL_URL is not set");
            return null;
          }

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siwe.domain !== nextAuthHost) {
            console.error("Domain mismatch");
            return null;
          }

          if (
            siwe.nonce !==
            (await getCsrfToken({ req: { headers: req.headers } }))
          ) {
            console.error("Nonce mismatch");
            return null;
          }

          await siwe.verify({ signature: credentials?.signature || "" });
          return {
            id: siwe.address,
          };
        } catch (e) {
          console.error("This is the error", e);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },

  debug: true,

  secret: process.env.NEXAUTH_SECRET,

  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.address = token.sub;
      session.user = {
        name: token.sub,
      };
      return session;
    },
  },
};
