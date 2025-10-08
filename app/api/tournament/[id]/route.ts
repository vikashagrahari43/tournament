// app/api/tournament/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connecttoDatabase } from "@/lib/db";
import Tournament from "@/model/Tournament";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params as Promise
) {
  try {
    await connecttoDatabase();

    // ✅ resolve the params promise
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Tournament ID is required" }, { status: 400 });
    }

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    return NextResponse.json({ tournament }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching tournament:", (error as Error).message);
    return NextResponse.json(
      { error: "Failed to fetch tournament details" },
      { status: 500 }
    );
  }
}
