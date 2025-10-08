import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import User from "@/model/User";

export async function DELETE() {
  try {
    await connecttoDatabase();

 
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

  
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.teamId) {
      return NextResponse.json(
        { error: "User is not part of any team" },
        { status: 400 }
      );
    }

    
    const team = await Team.findOne({ teamid: user.teamId });
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    
    if (team.owner.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "You are not authorized to delete this team" },
        { status: 403 }
      );
    }

    
    await Team.deleteOne({ _id: team._id });

    
    user.teamId = null;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Team deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
   
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
