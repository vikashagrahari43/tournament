import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import User from "@/model/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connecttoDatabase();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // ✅ Find user
    const user = await User.findOne({ email: session.user.email });
  
    if (!user.teamId) {
      return NextResponse.json(
        { error: "You are not part of any team yet" },
        { status: 404 }
      );
    }

    const team = await Team.findOne({ teamid: user?.teamId });
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Team Fetched Successfully", team },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in myteam API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
