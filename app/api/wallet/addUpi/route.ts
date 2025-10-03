import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Wallet from "@/model/Wallet";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connecttoDatabase();
    const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json(
        { error: "User Not Logged In problem in addupi api route" },
        { status: 401 }
      );
    }

    const { upiId } = await req.json();   // ✅ renamed properly

    if (!upiId || upiId.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid UPI ID" },
        { status: 400 }
      );
    }

    // ✅ Update wallet with correct schema field
    const wallet = await Wallet.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(session.user.id) },
      { upiId: upiId.trim().toLowerCase() },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { message: "UPI ID Added Successfully", upiId: wallet.upiId },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPI Add Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
