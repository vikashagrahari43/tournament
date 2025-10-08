import { NextRequest, NextResponse } from "next/server";
import { connecttoDatabase } from "@/lib/db";
import Tournament from "@/model/Tournament";
import Wallet from "@/model/Wallet";
import User from "@/model/User";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    await connecttoDatabase();

    // Await the params promise to get the id
    const { id } = await context.params;
    const { winnerEmail, teamName } = await request.json();

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    const user = await User.findOne({ email: winnerEmail });
    if (!user) {
      return NextResponse.json({ error: "Winner user not found" }, { status: 404 });
    }

    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      return NextResponse.json({ error: "Winner's wallet not found" }, { status: 404 });
    }

    // Add prize to wallet
    wallet.balance += tournament.prizePool;
    wallet.transactions.push({
      type: "tournament",
      amount: tournament.prizePool,
      status: "completed",
      description: `Prize for winning ${tournament.title} (${teamName})`,
      date: new Date(),
      userEmail: user.email,
    });

    await wallet.save();

    // Mark tournament as completed
    tournament.status = "completed";
    tournament.prizeSent = true;
    await tournament.save();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error sending prize:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Server error" },
      { status: 500 }
    );
  }
}
