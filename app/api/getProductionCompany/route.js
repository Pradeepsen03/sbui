import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const prodCompanies = await prisma.productionCompany.findMany({
            select: { name: true,id:true } // Only fetch the 'name' field
        });

        if (prodCompanies.length === 0) {
            return new Response(JSON.stringify({ error: "No production companies found" }), { 
                status: 404, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        console.log("Production Companies:", prodCompanies);

        return new Response(JSON.stringify({ data: prodCompanies }), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });

    } catch (error) {
        console.error("Error fetching production companies:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    } finally {
        await prisma.$disconnect();
    }
}
