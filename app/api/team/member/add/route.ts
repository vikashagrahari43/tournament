import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest) {
    try {
        await connecttoDatabase()
    
        const session = await getServerSession(authOptions);
       
        if (!session) {
            return NextResponse.json(
                { error: "The User is not authenticated"  },
                { status : 401 }
            )
        }
        
        
        const team = await Team.findOne({owner : session.user.id })
        if(!team){
            return NextResponse.json(
                { error : "The user has not any team" },
                { status : 404 }
            )
        }
        
        const { member }  = await req.json()
    
        if (!member?.name || !member?.bgmiId || !member?.role) {
          return NextResponse.json({ error: "All fields required" }, { status: 400 });
        }
    
        team.members.push({
            name: member.name,
            bgmiId: member.bgmiId,
            role: member.role,
        });
        await team.save();
    
        return NextResponse.json(
            {
                success  :true , team            
            })
    } catch (error : any) {
       return NextResponse.json(
            { error: "Error " + error.message },
            { status: 500 }
        )
    }
}