import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Helper function to connect to the database
async function connectDB() {
  const connect = await apiConnector;
  await connect.connectDB();
  return connect;
}



export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const connect = await connectDB();
    const session = await getServerSession(authOptions);
    const accessToken = req.headers.get("authorization")?.slice(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    const formData = await req.formData();


    const jobData = {
      candidateName: formData.get("candidateName"),
      position: formData.get("position"),
      salary: formData.get("salary"),
      offer: formData.get("offer"),
      contract: formData.get("contract"),
      notes: formData.get("notes"),
      jobid: formData.get("jobid"),
      candidate: params.id,
    };

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      jobData
    };


    
    
    const data = await connect.HireCondidate(reqQuery);
    return NextResponse.json({ message: "Meeting Schduled Successfully",data });
  } catch (e: any) {
    return NextResponse.json({ message: "Server error", error: e.message }, { status: 500 });
  }
};
