// pages/api/auth/me.js
import { cookies } from "next/headers"; // Access cookies server-side
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode("test");

export async function GET() {
    const token =  cookies().get("token")?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return new Response(JSON.stringify({ user: payload }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }
}
