import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Wallet from "@/model/Wallet";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){
    try {
        await connecttoDatabase();
    
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json(
                {error: "Unauthorized"},
                 {status: 401}
            )
        }
    
        let wallet = await Wallet.findOne({userId: session.user.id});
        if(!wallet){
            return NextResponse.json(
                wallet = await Wallet.create({
                    email: session.user.email,
                    userId: session.user.id,
                     balance: 0, 
                     transactions: [],
                     upiId: null,
                    }),
            )
        }
        return NextResponse.json({
            email: wallet.email,
            userId: wallet.userId,
            balance: wallet.balance,
            upiId: wallet.upiId || null,
            transactions: wallet.transactions
        });
    } catch (error) {
        console.error('Error fetching wallet data:', error);
        return NextResponse.json(
            {error: "Internal Server Error in fetching wallet data"},
            {status: 500}
        );
    }
}