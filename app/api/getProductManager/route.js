import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const projectManagers = await prisma.projectManager.findMany({
            select: { firstName: true, lastName: true ,id: true} // Fetch first and last name
        });

        if (projectManagers.length === 0) {
            return new Response(JSON.stringify({ error: "No project managers found" }), { 
                status: 404, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        const formattedManagers = projectManagers.map(manager => ({
            fullName: `${manager.firstName} ${manager.lastName}`,
            id:manager.id
        }));

        console.log("Project Managers:", formattedManagers);

        return new Response(JSON.stringify({ data: formattedManagers }), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });

    } catch (error) {
        console.error("Error fetching project managers:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    } finally {
        await prisma.$disconnect();
    }
}
