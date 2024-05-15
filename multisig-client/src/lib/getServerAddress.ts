import { authOptions } from "@/app/authOptions";
import { getServerSession } from "next-auth";

/**
 * Retrieves the server address from the server session.
 * @returns The server address if available, otherwise null.
 */
export const getServerAddress = async () => {
  const session = await getServerSession(authOptions);
  // this is actually the address
  if (!session?.user?.name) {
    return null;
  }
  return session.user.name;
};
