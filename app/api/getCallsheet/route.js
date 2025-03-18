import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const callSheets = await prisma.callSheets.findMany({
            include: {
                project: true 
            }
        });

        return new Response(JSON.stringify({ data: callSheets }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error fetching CallSheets:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    } finally {
        await prisma.$disconnect();
    }
}
