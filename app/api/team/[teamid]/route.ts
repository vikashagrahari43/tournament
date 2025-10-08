import { NextRequest, NextResponse } from "next/server";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import User from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ teamid: string }> } // ✅ params as Promise
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

    // ✅ resolve the params promise
    const { teamid } = await context.params;

    const team = await Team.findOne({ teamid });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 404 }
      );
    }

    if (user.teamId && user.teamId.toString() !== team.teamid.toString()) {
      return NextResponse.json(
        { error: "You already belong to another team" },
        { status: 400 }
      );
    }

    user.teamId = team.teamid;
    await user.save();

    return NextResponse.json({ success: true, team });
  } catch (error: unknown) {
    console.error("Error fetching team:", (error as Error).message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
