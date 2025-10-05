import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Wallet from "@/model/Wallet";

export async function GET(req: NextRequest) {
  try {
    await connecttoDatabase();

    // ✅ Check session
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).email !== "admin@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // ✅ Get all wallets
    const wallets = await Wallet.find();
    if (!wallets || wallets.length === 0) {
      return NextResponse.json(
        { error: "No wallets found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, wallets },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
