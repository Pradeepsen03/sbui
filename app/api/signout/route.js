import { cookies } from "node_modules/next/headers";

export async function GET() {
    cookies().delete("token"); 
    const cc=cookies()
    console.log("cookie",cc)
    return new Response(JSON.stringify({ message: "Logged out successfully" }), {
        status: 200,
        headers: {
            "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0;",
            "Content-Type": "application/json",
        },
    });
}
