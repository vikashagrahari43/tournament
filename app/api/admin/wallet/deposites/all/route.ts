import { NextResponse } from "next/server";
import { connecttoDatabase } from "@/lib/db";
import Wallet from "@/model/Wallet";

export async function GET() {
  try {
    await connecttoDatabase();

    // Find all wallets where there are "add" transactions
    const wallets = await Wallet.find({ "transactions.type": "add" }).lean();

    const deposits: any[] = [];
    wallets.forEach((wallet: any) => {
      wallet.transactions.forEach((txn: any) => {
        if (txn.type === "add") {
          deposits.push({
            userEmail: txn.userEmail,
            transactionId: txn._id.toString(),
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
    console.error("GET /api/admin/deposits/all error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
