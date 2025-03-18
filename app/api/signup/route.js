import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = "test"; // Change this in production

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
        }

        // Find user in the database
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        // Generate JWT token with userId, email, and role
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: "1h" }
        );

        // Optionally set the token as an HttpOnly cookie (more secure)
        const headers = new Headers({
            "Content-Type": "application/json",
            "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600;`
        });

        return new Response(JSON.stringify({ message: "Login successful", token, role: user.role }), { status: 200, headers });

    } catch (error) {
        console.error("Sign-in error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure Prisma disconnects after request
    }
}
