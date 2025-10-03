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

    if (!session || !session.user?.id || !session.user?.email) {
      return NextResponse.json(
        { error: "User not logged in" },
        { status: 401 }
      );
    }

    const { amount, upiId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { error: "Minimum withdrawal amount is ₹100" },
        { status: 400 }
      );
    }

    const wallet = await Wallet.findOne({
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }

    if (amount > wallet.balance) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Add withdrawal transaction (status: pending)
    wallet.transactions.push({
      type: "withdraw",
      amount,
      status: "pending", // admin will approve
      description: `Withdrawal request to ${upiId}`,
      date: new Date(),
      userEmail: session.user.email,
    });

    await wallet.save();

    return NextResponse.json(
      {
        message:
          "Withdrawal request submitted successfully. Processing within 24-48 hours.",
        wallet,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Withdraw API Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error in withdraw API route",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
