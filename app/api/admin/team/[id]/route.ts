import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import User from "@/model/User";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    await connecttoDatabase();

    const session = await getServerSession(authOptions);
    if (!session || session.user.email !== "admin@gmail.com") {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Await the params promise
    const { id: teamId } = await context.params;

    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    const team = await Team.findOne({ teamid: teamId });
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const owner = await User.findById(team.owner).select("email username");
    const teamData = {
      ...team.toObject(),
      createdby: owner?.email || "Unknown",
    };

    return NextResponse.json({ success: true, team: teamData }, { status: 200 });
  } catch (error: unknown) {
    console.error("Team Details API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch team details" },
      { status: 500 }
    );
  }
}
