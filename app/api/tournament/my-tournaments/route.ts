// app/api/tournament/my-tournaments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/model/User";
import Tournament from "@/model/Tournament";
import { connecttoDatabase } from "@/lib/db";

export async function GET() {
  try {
    await connecttoDatabase();

    // get logged-in user
    const session = await getServerSession(authOptions);
    if (!session || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.teamId) {
      return NextResponse.json({ tournaments: [] }); // no team means no tournaments
    }

    // find tournaments where this team has enrolled
    const tournaments = await Tournament.find({
      "participants.teamId": user.teamId,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ tournaments }, { status: 200 });
  } catch (error: unknown) {
    console.error("My Tournaments Error:", (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
