
import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Wallet, { ITransaction } from "@/model/Wallet";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connecttoDatabase();
    const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
          return NextResponse.json(
            { error: "User not logged in" },
            { status: 401 }
          );
        }

    const wallets = await Wallet.find(
      { "transactions.type": "withdraw" },
      { transactions: 1, userId: 1 }
    ).populate("userId", "email");

    const withdrawals = wallets.flatMap((wallet) =>
    (wallet.transactions as ITransaction[])
    .filter((tx) => tx.type === "withdraw")
        .map((tx) => ({
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
    
    return NextResponse.json(
      { error: "Failed to fetch all withdrawals", details: (err as Error).message },
      { status: 500 }
    );
  }
}
