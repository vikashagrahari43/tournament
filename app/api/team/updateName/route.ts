import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team from "@/model/Team";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest ) {
  
 try {
  await connecttoDatabase()
 
  const session = await getServerSession(authOptions)
  if(!session){
    return NextResponse.json(
       {error: "User Not Authenticated"},
       {status : 400}
     )
  }
  const { name } = await req.json()
  if(!name){
    return NextResponse.json(
       {error: "Team Name is not Found"},
       {status : 400}
     )
  }
 
  const updatedTeam = await Team.findOneAndUpdate(
   {owner : session.user.id},
   {$set: {name} },
   {new: true, runValidators:true }
 
 )
 if (!updatedTeam) {
       return NextResponse.json(
         { error: "Team not found" }, 
         { status: 404 }
       );
     }
  return NextResponse.json(
       { message: "Team name updated successfully", team: updatedTeam },
       { status: 200 }
     );
 } catch (error) {
    return NextResponse.json(
       { error : "Api is not running properly", },
       { status: 500 }
     );
 }
}

