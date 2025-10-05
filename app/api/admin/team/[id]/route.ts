
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import User from "@/model/User";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Connect DB
    await connecttoDatabase();
    // Check admin session

    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).email !== "admin@gmail.com") {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    // Validate team id
     const { id } = await params;
    const teamId = id;
    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    // Find team
    const team = await Team.findOne({ teamid: teamId });
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Get team owner's email (if available)
    const owner = await User.findById(team.owner).select("email username");
    const teamData = {
      ...team.toObject(),
      createdby: owner?.email || "Unknown",
    };

    // Return data
    return NextResponse.json(
      { success: true, team: teamData },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Team Details API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch team details" },
      { status: 500 }
    );
  }
}
