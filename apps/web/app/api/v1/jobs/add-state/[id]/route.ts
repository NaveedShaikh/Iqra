import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Helper: Get access token from headers or session
async function getAccessToken(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const authorizationHeader = req.headers.get("authorization");

  const accessToken = authorizationHeader
    ? authorizationHeader.substring(7)
    : session?.user.accessToken;

  if (!accessToken) {
    throw new Error("User not authenticated");
  }
  return accessToken;
}



export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
    const accessToken = await getAccessToken(req);

    const jobId = params.id;
    const { state } = await req.json();
    await connect.addJobState(state,jobId);

    return NextResponse.json(
      { message: "State Add Successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    const status = e.message === "User not authenticated" ? 401 : 500;
    return NextResponse.json(
      { message: e.message, error: "Server Error" },
      { status }
    );
  }
}
