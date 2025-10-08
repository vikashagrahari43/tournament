
import { NextResponse } from "next/server";
import Tournament from "@/model/Tournament";
import { connecttoDatabase } from "@/lib/db";


export async function GET() {
  try {
    await connecttoDatabase();
   

    const tournaments = await Tournament.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, tournaments },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
