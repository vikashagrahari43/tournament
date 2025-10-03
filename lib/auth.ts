import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connecttoDatabase } from "./db";
import User from "@/model/User";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions ={
 providers : [
    CredentialsProvider({
        name: "Credentials",

        credentials : {
                email: { label: "Email", type: "text",},
                password: { label: "Password", type: "password" },
        },

        async authorize(credentials) {
            if(!credentials?.email || !credentials?.password ){
                throw new Error("Missing Email Password and Username");
            }
            
            try {
                await connecttoDatabase() ;
                const user = await User.findOne({ email : credentials.email});
                
                if(!user){
                    throw new Error("No user found with this email please Register!!")
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid){
                    throw new Error("invalid password");
                }

                return {
                    id : user._id.toString(),
                    email: user.email,
                };

            } catch (error) {
                console.error("Auth error: ", error);
                throw error;
            }
        },
     }),

     CredentialsProvider({
        id: "admin-login",
        name: "Admin Credentials",
        credentials: {
            username: {label : "Username", type: "text"},
            password: {label : "Password", type: "password"},
        },
        async authorize(credentials) {
            if(
                credentials?.username === process.env.ADMIN_USERNAME && credentials?.password === process.env.ADMIN_PASSWORD
            ) {
                return {
                    id : "admin",
                    email : "admin@gmail.com",
                    
                }
            }
            throw new Error("Invalid Admin Credentials")
        }
     })
 ],


 callbacks: {
    async jwt({ token, user}) {
        if(user) {
            token.id = user.id ;
        }
        return token ;
    }, 
    async session({session, token }) {
        if (session.user) {
            session.user.id = token.id as string ;
        }
        return session;
    },
 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};