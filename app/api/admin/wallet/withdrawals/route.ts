
import { connecttoDatabase } from "@/lib/db";
import Wallet, { ITransaction } from "@/model/Wallet";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connecttoDatabase();

    // find only pending withdrawal transactions
    const wallets = await Wallet.find(
      { "transactions.type": "withdraw", "transactions.status": "pending" },
      { "transactions": 1, userId: 1 } // project only pending tx
    ).populate("userId", "email");

    const withdrawals = wallets.flatMap((wallet) =>
      wallet.transactions.map((tx : ITransaction) => ({
        _id: tx._id,
        userId: wallet.userId._id,
        userEmail: wallet.userId.email,
        amount: tx.amount,
        upiId: tx.description?.replace("Withdrawal request to ", "") || "",
        status: tx.status,
        date: tx.date,
      }))
    );

    return NextResponse.json({ withdrawals }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error in GET withdrawals (pending):", err);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals", details: (err as Error).message },
      { status: 500 }
    );
  }
}
