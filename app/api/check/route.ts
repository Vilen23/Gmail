import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(NEXT_AUTH);
    console.log(session);
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: { message: "Internal server error" },
    };
  }
};
