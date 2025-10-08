import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Wallet from "@/model/Wallet";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


export async function POST(req: NextRequest) {
    try {
        await connecttoDatabase();
        const session = await getServerSession(authOptions);
        
        if(!session || !session.user.email){
            return NextResponse.json(
                {error: "User Not Logged In problem in addrequest api route"},
                {status: 401}
            )
        }
    
        const {amount, screenshotUrl} = await req.json();
    
        if(!amount || !screenshotUrl || amount <= 0){
            return NextResponse.json(
                {error: "Invalid Amount or Input"},
                {status: 400}
            )
        }
        // console.log("Add Money Request by ", session.user.email, " Amount : ", amount);
        const wallet = await Wallet.findOneAndUpdate(
            {userId : new mongoose.Types.ObjectId(session.user.id)},
            {
                $push :{
                    transactions: {
                        userEmail: session.user.email,
                        type : "add",
                        amount,
                        status: "pending",
                        description : "Add Money Request",
                        screenshotUrl,
                        date: new Date(),
    
                    }
                }
            },
            { new : true, upsert: true}
        );
    
        return NextResponse.json(
            { message: "Deposite Request Sent Successfully", wallet },
            {status: 200}
        )
    } catch (error: unknown) {
        return NextResponse.json(
            {error : "Internal Server Error in addrequest api route ", details: (error as Error).message},
            {status : 500}
        )
    }
}