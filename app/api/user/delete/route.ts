import { NextRequest, NextResponse } from "next/server";
import { connecttoDatabase } from "@/lib/db";
import User from "@/model/User";
import { getToken } from "next-auth/jwt"; 
import Team from "@/model/Team";
import Wallet from "@/model/Wallet";


export async function DELETE(req: NextRequest) {
  try {
    await connecttoDatabase();

    // 🔐 Get the logged-in user from JWT/session
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🧾 Find the user
    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

   
    await User.deleteOne({ email: token.email });

   
    await Team.deleteMany({ owner: user._id });
    await Wallet.deleteOne({ userId: user._id });
   

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
