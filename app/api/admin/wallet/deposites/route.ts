import {  NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Wallet from "@/model/Wallet";

export async function GET() {
  try {
    await connecttoDatabase();
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).email !== "admin@gmail.com") {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Sirf deposit (type:add) aur pending wale chahiye
    const wallets = await Wallet.find({
      "transactions": {
        $elemMatch: { type: "add", status: "pending" }
      }
    }).select("userId transactions");

    // Flatten all pending deposit requests
    const pendingDeposits = wallets.flatMap((wallet) =>
      wallet.transactions.filter((txn :any) => txn.type === "add" && txn.status === "pending")
        .map((txn :any) => ({
          userEmail: txn.userEmail,
          walletId: wallet._id,
          userId: wallet.userId,
          transactionId: txn._id,
          amount: txn.amount,
          screenshotUrl: txn.screenshotUrl, // 👈 yeh aa jayega
          date: txn.date,
          status: txn.status,
        }))
    );

    return NextResponse.json({ deposits: pendingDeposits }, { status: 200 });
  } catch (err) {
    console.error("GET deposits error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
