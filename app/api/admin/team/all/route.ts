import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connecttoDatabase();

    const session = await getServerSession(authOptions); // ✅ FIXED (added await)

    if (!session || (session.user as any).email !== "admin@gmail.com") {
      return NextResponse.json(
        { error: "User not Authenticated" },
        { status: 401 } // better status for unauthorized
      );
    }

    const teams = await Team.find(); // ✅ rename to plural (good practice)

    if (!teams || teams.length === 0) {
      return NextResponse.json(
        { error: "No teams found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, teams },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
