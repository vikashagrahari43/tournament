// app/api/admin/tournament/room/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Tournament from "@/model/Tournament";
import { connecttoDatabase } from "@/lib/db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is a Promise
) {
  try {
    await connecttoDatabase();

    // Check session & ensure admin email
    const session = await getServerSession(authOptions);
    if (!session || session.user.email !== "admin@gmail.com") {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Get body
    const { RoomId, RoomPass } = await req.json();
    if (!RoomId || !RoomPass) {
      return NextResponse.json({ error: "Room ID and Password are required" }, { status: 400 });
    }

    // Await params to get the tournament ID
    const { id } = await context.params;

    // Update tournament
    const tournament = await Tournament.findByIdAndUpdate(
      id,
      { RoomId, RoomPass },
      { new: true }
    );

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Room details added successfully",
      tournament,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("Admin Room Update Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Server error" },
      { status: 500 }
    );
  }
}
