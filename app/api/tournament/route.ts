
import { NextResponse } from "next/server";
import Tournament from "@/model/Tournament";
import { connecttoDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connecttoDatabase();
    const session = await getServerSession(authOptions);
    if (!session){
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tournaments = await Tournament.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, tournaments },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
