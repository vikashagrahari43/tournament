import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// ✅ Define a proper type for session.user
interface SessionUser {
  id: string | null;
  email: string | null;
}

export async function GET() {
  try {
    await connecttoDatabase();

    const session = await getServerSession(authOptions);

    const user = session?.user as SessionUser | null;

    if (!user || user.email !== "admin@gmail.com") {
      return NextResponse.json(
        { error: "User not Authenticated" },
        { status: 401 }
      );
    }

    const teams = await Team.find();

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

  } catch (error: unknown) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
