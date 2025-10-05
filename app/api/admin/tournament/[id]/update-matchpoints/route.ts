import { NextRequest, NextResponse } from "next/server";
import { connecttoDatabase } from "@/lib/db";
import Tournament from "@/model/Tournament";
    

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connecttoDatabase();
    const { id } = params;
    const { teamId, matchpoints } = await request.json();

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    const participant = tournament.participants.find((p: any) => p.teamId === teamId);
    if (!participant) {
      return NextResponse.json({ error: "Team not found in this tournament" }, { status: 404 });
    }

    participant.Matchpoints = matchpoints;
    await tournament.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating matchpoints:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
