import { NextRequest, NextResponse } from "next/server";
import { connecttoDatabase } from "@/lib/db";
import Tournament from "@/model/Tournament";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connecttoDatabase();
    const { id } = await params;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    return NextResponse.json({ tournament });
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
