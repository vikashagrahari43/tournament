
import { NextResponse } from "next/server";
import Tournament from "@/model/Tournament";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connecttoDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connecttoDatabase();
    const session = await getServerSession(authOptions);
     if (!session || session.user.email !== "admin@gmail.com") {
      return NextResponse.json(
        { error: "Not authorized" },
         { status: 401 });
    }
    
    const { title, slogan, prizePool, entryFee, maxTeams, date, time } =
      await req.json();

    const newTournament = await Tournament.create({
      title,
      slogan,
      prizePool,
      entryFee,
      maxTeams,
      date,   
      time,   
    });

    return NextResponse.json(
        { success: true,  newTournament },
         { status: 201 }
        );

  } catch (error: unknown) {
    return NextResponse.json(
        { success: false, error: (error as Error).message }
        , { status: 500 }
    );
  }
}
