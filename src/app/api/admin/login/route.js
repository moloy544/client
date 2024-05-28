import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    try {

        // extract user and password from request
        const { user, password } = await req.json() || {};

        // get admin login credentials from environment variables
        const admin_userName = process.env.ADMIN_USERNAME;
        const admin_password = process.env.ADMIN_PASSWORD;

        // check if any required credentials is missing or not
        if (!user || !password) {
            return NextResponse.json({ message: "Please provide username and password" }, { status: 400 });

            //match request login credentials is match with environment variables admin login credentials or not
        } else if (user.match(admin_userName) && password.match(admin_password)) {

            // Check if the environment is production
            const isProduction = process.env.NODE_ENV === 'production';

            // Calculate token expiration date (30 days from now)
            const adminExpiration = new Date();
            adminExpiration.setDate(adminExpiration.getDate() + 30);

            // set admin cookie with admin usrname value
            cookies().set('admin', user, {
                path: '/admin',
                sameSite: 'strict',
                secure: isProduction,
                httpOnly: true,
                sameSite: isProduction ? 'none' : 'lax',
                expires: adminExpiration
            });
            return NextResponse.json({ message: "Login successfull" }, { status: 200 });
        } else {

            // if login credentials is not match with environment variables admin login credentials then return error message
            return NextResponse.json({ message: "Invalid username or password" }, { status: 400 })
        };

    } catch (error) {
        console.log(error);

        // if any error occurs then return error message
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }
};