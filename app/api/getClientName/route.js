import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const client = await prisma.client.findMany({
            select: { firstName: true, lastName: true,id:true } // Fetch first and last name
        });

        if (client.length === 0) {
            return new Response(JSON.stringify({ error: "No client found" }), { 
                status: 404, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        const formattedclient = client.map(client => ({
            fullName: `${client.firstName} ${client.lastName}`,
            id:client.id
        }));

        console.log("hhhhhh",formattedclient)

        console.log("Project Managers:", formattedclient);

        return new Response(JSON.stringify({ data: formattedclient }), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });

    } catch (error) {
        console.error("Error fetching client:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    } finally {
        await prisma.$disconnect();
    }
}
