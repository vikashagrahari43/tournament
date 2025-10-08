import { NextResponse } from "next/server";
import { connecttoDatabase } from "@/lib/db";
import Wallet, { IWallet, ITransaction } from "@/model/Wallet";

interface DepositInfo {
  userEmail?: string;
  transactionId: string;
  userId: string;
  amount: number;
  date: Date;
  status: "pending" | "completed" | "failed";
  screenshotUrl?: string;
}

export async function GET() {
  try {
    await connecttoDatabase();

    // Find all wallets where at least one transaction type is "add"
    const wallets = await Wallet.find({ "transactions.type": "add" }).lean<IWallet[]>();

    const deposits: DepositInfo[] = [];

    wallets.forEach((wallet) => {
      wallet.transactions.forEach((txn: ITransaction) => {
        if (txn.type === "add") {
          deposits.push({
            userEmail: txn.userEmail,
            transactionId: txn._id?.toString() || "",
            userId: wallet.userId.toString(),
            amount: txn.amount,
            date: txn.date,
            status: txn.status,
            screenshotUrl: txn.screenshotUrl,
          });
        }
      });
    });

    return NextResponse.json({ deposits }, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/wallet/deposits/all error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
