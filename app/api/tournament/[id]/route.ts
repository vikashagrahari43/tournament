// app/api/tournament/[id]/route.ts
import { NextResponse } from "next/server";
import { connecttoDatabase } from "@/lib/db";
import Tournament from "@/model/Tournament";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connecttoDatabase();

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Tournament ID is required" }, { status: 400 });
    }

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    return NextResponse.json({ tournament }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching tournament:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournament details" },
      { status: 500 }
    );
  }
}
