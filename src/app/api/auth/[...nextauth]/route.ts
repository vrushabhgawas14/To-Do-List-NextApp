// [project]/src/app/api/auth/[...nextauth]/route.ts

import { connectDatabase } from "@/lib/mongoDB";
import { User } from "@/models/Users";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth"; // <-- Optional but good for typing

// 1. Define your entire NextAuth configuration object separately (Best Practice)
const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "select_account",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            await connectDatabase();

            const existingUser = await User.findOne({ email: user.email });

            if (!existingUser) {
                await User.create({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                });
            }

            return true;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

// 2. Create the NextAuth handler function using the configuration
const handler = NextAuth(authOptions);

// 3. Export the named GET and POST methods. 
// These are required by the Next.js App Router for API routes.
export { handler as GET, handler as POST };