import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";
import Team, { ITeamMember } from "@/model/Team";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE( req : NextRequest) {
   try {
     await connecttoDatabase() ;
     const session = await getServerSession(authOptions)
     
     if(!session){
        return NextResponse.json(
            {error : "User not Authenticated"},
            {status : 401}
        )
     }
     const { memberId } = await req.json()
     if (!memberId){
        return NextResponse.json(
            {error :"MemberId required"},
            {status : 400 }
        )
     }
     const team = await Team.findOne( { owner : session.user.id } )
        if(!team){
         return NextResponse.json(
          {error : "You are not the owner of this team"},
          {status : 500}
       )
    }

    team.members = team.members.filter((m: ITeamMember) => m._id && m._id.toString() !== memberId)
    team.save()
     return NextResponse.json(
        { success: true, team },
        { status: 200 }
     );

   } catch (error) {
     return NextResponse.json(
        {  error: "Failed to delete member" }
        , { status: 500 });
   }


}