import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Function to generate a random alphanumeric string of a specified length
function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function POST() {
    try {
        // Generate a 20-digit random user ID
        const randomUserId = generateRandomID(20);

        // Check if the environment is production
        const isProduction = process.env.NODE_ENV === 'production';

        // Define cookie expiration for 1 year
        const cookieMaxAge = 365 * 24 * 60 * 60; // 1 year in seconds

        // Set the 'user' cookie with the random ID
        cookies().set('moviesbazar_user', randomUserId.toString(), {
            path: '/', // The cookie is available throughout the site
            sameSite: isProduction ? 'none' : 'lax', // Cookie security
            secure: isProduction, // Secure cookie in production
            httpOnly: true, // Prevent client-side JS from accessing the cookie
            maxAge: cookieMaxAge, // Set max age to 1 year
        });


        return NextResponse.json({ message: "User created successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Something went wrong while creating uer" }, { status: 500 });
    }
}
