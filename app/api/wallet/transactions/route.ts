import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Wallet, { ITransaction } from "@/model/Wallet";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connecttoDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const wallet = await Wallet.findOne({
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!wallet) {
      return NextResponse.json({ transactions: [] }, { status: 200 });
    }

    // map mongoose transactions → frontend format
    const transactions = wallet.transactions.map((t: ITransaction) => ({
      _id: t._id ? t._id.toString() : "",
      type: t.type,
      title: t.description || "Transaction",
      date: t.date.toISOString(), // send ISO string
      amount: t.amount,
      status: t.status,
    }));

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
