import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        // Generate a 15-digit random user ID
        const randomUserId = Math.floor(Math.random() * 900000000000000) + 100000000000000;

        // Check if the environment is production
        const isProduction = process.env.NODE_ENV === 'production';

        // Set the 'user' cookie with the random ID
        cookies().set('user', randomUserId.toString(), {
            path: '/', // The cookie is available throughout the site
            sameSite: isProduction ? 'none' : 'lax', // Cookie security
            secure: isProduction, // Secure cookie in production
            httpOnly: true, // Prevent client-side JS from accessing the cookie
        });

        return NextResponse.json({ message: "User created successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Something went wrong while creating uer" }, { status: 500 });
    }
}
