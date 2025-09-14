import { connecttoDatabase } from "@/lib/db";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request : NextRequest){

   try {
     const {username, email, password} = await request.json()
     console.log("username", username , email, password)
     if(!username || !email || !password){
         return NextResponse.json(
             {  error : "Please enter the name, email, and password correctly"   },
             {  status : 400 }
         )
     }
 
     await connecttoDatabase() ; 
 
     const existingUser = await User.findOne({ email });
     if (existingUser){
          return NextResponse.json(
             {  error : "The User Already Existed"   },
             {  status : 400 }
         )
     }
 
     await User.create(
         {
             username,
             email, 
             password
         }
     )
 
     return NextResponse.json(
         {message : "Registration Successfull"},
         {status : 200 }
     )
 
 } catch (error) {
    console.log("Registration Error in register api" , error);
    return NextResponse.json(
         {message : "Failed to register User"},
         {status : 400 }
     )
 }
}