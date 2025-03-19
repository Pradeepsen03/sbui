import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Fetch all equipment with optional crew member details
        const equipments = await prisma.equipments.findMany({
            include: {
                crewMember: true, // Include crew member details if available
            },
        });

        return new Response(JSON.stringify({ data: equipments }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching equipments:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        await prisma.$disconnect();
    }
}
