// app/api/tournament/enroll/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Tournament from "@/model/Tournament";
import User from "@/model/User";
import Team from "@/model/Team";
import Wallet from "@/model/Wallet";
import { connecttoDatabase } from "@/lib/db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params as Promise
) {
  try {
    await connecttoDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.teamId) {
      return NextResponse.json({ error: "You must join or create a team first" }, { status: 400 });
    }

    const team = await Team.findOne({ teamid: user.teamId });
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    if (team.members.length < 4) {
      return NextResponse.json({ error: "Team must have at least 4 members" }, { status: 400 });
    }

    // ✅ resolve params promise
    const { id } = await context.params;

    const tournament = await Tournament.findById(id);
    if (!tournament) return NextResponse.json({ error: "Tournament not found" }, { status: 404 });

    if (tournament.status !== "registering") {
      return NextResponse.json({ error: "Tournament is not open for registration" }, { status: 400 });
    }

    if (tournament.enrolledTeams! >= tournament.maxTeams) {
      return NextResponse.json({ error: "Tournament is full" }, { status: 400 });
    }

    // Check if team already enrolled
    if ((tournament.participants as { teamId: string }[])?.some(
      (p) => p.teamId === user.teamId
    )) {
      return NextResponse.json({ error: "Your team is already enrolled" }, { status: 400 });
    }

    // Deduct from wallet
    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    if (wallet.balance < tournament.entryFee) {
      return NextResponse.json({ error: "Insufficient wallet balance & Please Add Funds" }, { status: 400 });
    }

    // Deduct balance & log transaction
    wallet.balance -= tournament.entryFee;
    wallet.transactions.push({
      type: "tournament",
      amount: tournament.entryFee,
      status: "completed",
      description: `Joined tournament: ${tournament.title}`,
      date: new Date(),
      userEmail: user.email
    });
    await wallet.save();

    // Add team to tournament participants
    tournament.participants?.push({
      teamId: team.teamid!,
      teamName: team.name,
      OwnerEmail: user.email,
      joinedAt: new Date(),
    });
    tournament.enrolledTeams = (tournament.enrolledTeams || 0) + 1;

    // If full
    if (tournament.enrolledTeams >= tournament.maxTeams) {
      tournament.status = "full";
    }

    await tournament.save();

    return NextResponse.json(
      { success: true, message: "Team enrolled successfully", tournament },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Enroll Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
