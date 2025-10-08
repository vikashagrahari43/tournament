import { connecttoDatabase } from "@/lib/db";
import Wallet from "@/model/Wallet";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ fix here
) {
  try {
    await connecttoDatabase();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "User not logged in" },
        { status: 401 }
      );
    }

    const { action } = await req.json();

    // ✅ await params to extract id
    const { id } = await context.params;

    if (!["complete", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Find wallet containing this transaction
    const wallet = await Wallet.findOne({ "transactions._id": id });

    if (!wallet) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    const transaction = wallet.transactions.id(id);
    if (!transaction || transaction.type !== "withdraw") {
      return NextResponse.json(
        { error: "Withdrawal transaction not found" },
        { status: 404 }
      );
    }

    if (transaction.status !== "pending") {
      return NextResponse.json(
        { error: "Request already processed" },
        { status: 400 }
      );
    }

    if (action === "complete") {
      if (wallet.balance < transaction.amount) {
        return NextResponse.json(
          { error: "Insufficient balance in wallet" },
          { status: 400 }
        );
      }

      wallet.balance -= transaction.amount;
      transaction.status = "completed";
    } else if (action === "reject") {
      transaction.status = "failed";
    }

    await wallet.save();

    return NextResponse.json(
      {
        message: `Withdrawal ${action}d successfully`,
        withdrawal: {
          _id: transaction._id,
          status: transaction.status,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to update withdrawal", details: (err as Error).message },
      { status: 500 }
    );
  }
}
