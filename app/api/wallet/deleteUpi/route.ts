// src/app/api/wallet/deleteUpi/route.ts
import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Wallet from "@/model/Wallet";
import { getServerSession } from "next-auth";
import {  NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE() {
  try {
    await connecttoDatabase();
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "User Not Logged In" },
        { status: 401 }
      );
    }

    const wallet = await Wallet.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(session.user.id) },
      { $unset: { upiId: "" } }, // ✅ remove field
      { new: true }
    );

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "UPI ID deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete UPI Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
