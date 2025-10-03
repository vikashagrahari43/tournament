import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Wallet from "@/model/Wallet";

export async function PUT(req: NextRequest, { params }: { params: { transactionId: string } }) {
  try {
    await connecttoDatabase();
    const session = await getServerSession(authOptions);

    if (!session ) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { transactionId } = params;
    const { action } = await req.json(); // { action: "approve" | "reject" }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const wallet = await Wallet.findOne({ "transactions._id": transactionId });
    if (!wallet) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const txn = wallet.transactions.id(transactionId);
    if (!txn) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (txn.status !== "pending") {
      return NextResponse.json({ error: `Transaction already ${txn.status}` }, { status: 400 });
    }

    if (action === "reject") {
      txn.status = "failed";
      await wallet.save();
      return NextResponse.json(
        { message: "Transaction rejected", transaction: txn },
        { status: 200 }
      );
    }

    if (action === "approve") {
      txn.status = "completed";
      wallet.balance += txn.amount; // balance update
      await wallet.save();
      return NextResponse.json(
        {
          message: "Transaction approved and wallet updated",
          transaction: txn,
          balance: wallet.balance,
        },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("PUT deposits error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
