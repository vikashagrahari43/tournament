import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req : NextRequest) {
    
    try {
         await connecttoDatabase()
       
        const session = await getServerSession(authOptions)
        if(!session){
           return NextResponse.json(   
               { error : "User not authenticated" },
               {status : 401}
            )
        }
    
        const {name , members} = await req.json();
    
        if(!name || !members){
            return NextResponse.json({ error: "name and members are reqired" }, { status: 400 });
        }
    
       if ( members.length < 4 || members.length > 6) {
        return NextResponse.json({ error: "Team must have 4–6 members" }, { status: 400 });
      }
      if (!session?.user?.id) {
        return NextResponse.json({ error: "User ID missing from session" }, { status: 401 });
      }
    
      const already = await Team.findOne({ owner : session.user.id })
      if(already){
        return NextResponse.json(
            {error : "Team is already available with this user"},
            {status : 401}
        )
      }
    
      const team = await Team.create({
        owner : session.user.id, 
        name,
        members,
      });
    
      return NextResponse.json(
        {message : "Team created successfully", team},
        {status : 201}
      );
    } catch (error: any) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
    }
} 