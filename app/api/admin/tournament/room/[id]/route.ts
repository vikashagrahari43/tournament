// app/api/admin/tournament/room/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Tournament from "@/model/Tournament";
import { connecttoDatabase } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connecttoDatabase();

    // ✅ Check session & ensure admin email
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).email !== "admin@gmail.com") {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    // ✅ Get body
    const { RoomId, RoomPass } = await req.json();

    if (!RoomId || !RoomPass) {
      return NextResponse.json(
        { error: "Room ID and Password are required" },
        { status: 400 }
      );
    }
    const paramid =  params.id ;

    // ✅ Update tournament
    const tournament = await Tournament.findByIdAndUpdate(
      paramid,
      { RoomId, RoomPass },
      { new: true }
    );

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Room details added successfully", tournament },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Admin Room Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
