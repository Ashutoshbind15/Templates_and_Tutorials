import { options1 } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export const GET = async (req: Request) => {
  const session = await getServerSession(options1);
  if (!session) {
    return { error: "Unauthorized" };
  }
};
