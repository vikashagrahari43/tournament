import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Wallet, { IWallet, ITransaction } from "@/model/Wallet";

// ✅ Properly typed session user
interface SessionUser {
  id: string;
  email: string;
}

export async function GET() {
  try {
    await connecttoDatabase();
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | null;

    // ✅ Type-safe check
    if (!user || user.email !== "admin@gmail.com") {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // ✅ Wallets that have at least one pending "add" transaction
    const wallets: IWallet[] = await Wallet.find({
      transactions: { $elemMatch: { type: "add", status: "pending" } },
    }).select("userId transactions");

    // ✅ Flatten pending deposit requests (no `any`)
    const pendingDeposits = wallets.flatMap((wallet) =>
      wallet.transactions
        .filter(
          (txn: ITransaction) =>
            txn.type === "add" && txn.status === "pending"
        )
        .map((txn: ITransaction) => ({
          userEmail: txn.userEmail,
          walletId: wallet._id,
          userId: wallet.userId,
          transactionId: txn._id,
          amount: txn.amount,
          screenshotUrl: txn.screenshotUrl,
          date: txn.date,
          status: txn.status,
        }))
    );

    return NextResponse.json({ deposits: pendingDeposits }, { status: 200 });
  } catch (err: unknown) {
    console.error("GET deposits error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
