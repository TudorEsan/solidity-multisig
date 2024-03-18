import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const getServerAddress = async () => {
  const session = await getServerSession(authOptions);
  // this is actually the address
  if (!session?.user?.name) {
    return null;
  }
  return session.user.name;
};
