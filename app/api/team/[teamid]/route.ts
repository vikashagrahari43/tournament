import { NextRequest, NextResponse } from "next/server";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import User from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { teamid: string } }
) {
  try {
    await connecttoDatabase();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { teamid } = await params;
    
    const team = await Team.findOne({ teamid: teamid }); // ⚠️ use "teamid" since you set it like that in create

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // ✅ find the current user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 404 }
      );
    }

    // ✅ Check if user already has a team
    if (user.teamId && user.teamId.toString() !== team.teamid.toString()) {
      return NextResponse.json(
        { error: "You already belong to another team" },
        { status: 400 }
      );
    }

    // ✅ Assign this team to the user
    user.teamId = team.teamid;
    await user.save();

    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
