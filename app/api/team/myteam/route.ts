import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connecttoDatabase()

        const session = await getServerSession(authOptions)
        if(!session){
           return NextResponse.json(
                {error : "User not authenticated"},
                {status : 401}
            )
        }

        const team = await Team.findOne({owner : session.user.id})
        if(!team){
            return NextResponse.json(
                {error : "Team is not created Yet Please Create "},
                {status: 404}
            )
        }

        return NextResponse.json( 
            {message : "Team Fetched Successfully", team},
            {status: 200}
        )


    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}