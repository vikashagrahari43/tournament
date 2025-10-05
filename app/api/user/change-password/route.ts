import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/model/User";
import { connecttoDatabase } from "@/lib/db";
import { getToken } from "next-auth/jwt"; // only if you're using next-auth

export async function POST(req: NextRequest) {
  try {
    await connecttoDatabase();

    //  Get user from session (assuming next-auth)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    // Basic validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    // Hash and update new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword; 
    await user.save();

    return NextResponse.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
