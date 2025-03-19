import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode("test");

const userRoutes = ["/", "/components"];
const adminRoutes = [...userRoutes, "/layout-vertical", "/pages"];

export async function middleware(request) {
    console.log("Middleware running for:", request.url);

    // Exclude authentication pages from middleware
    if (
        request.nextUrl.pathname.startsWith("/authentication") ||
        request.nextUrl.pathname.startsWith("/api")
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get("token")?.value;
    console.log("Extracted Token:", token);

    if (!token) {
        console.log("❌ No token found. Redirecting to login...");
        return NextResponse.redirect(new URL("/authentication/sign-in", request.url));
    }

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        console.log("✅ Decoded Token:", payload);

        // Redirect users if they don't have admin access but try to visit admin pages
        if (adminRoutes.includes(request.nextUrl.pathname) && payload.role !== "ADMIN") {
            console.log("⛔ Unauthorized access. Redirecting...");
            return NextResponse.redirect(new URL("/vdashboard", request.url)); // Redirect to home or another allowed page
        }
    } catch (error) {
        console.log("❌ JWT Verification Error:", error.message);
        return NextResponse.redirect(new URL("/authentication/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/","/vdashboard","/projects","/client","/callsheet","/crewMember"], // Skip authentication and API routes
};
