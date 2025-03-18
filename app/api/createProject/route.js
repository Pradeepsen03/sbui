import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { 
            productionCompany, // Sent as single ID
            projectName, 
            startDate, 
            endDate, 
            status, 
            clientName, // Sent as single ID
            projectManager, // Sent as single ID
            projectNumber
        } = body;

        // Convert string IDs to integers
        const productionCompanyId = parseInt(productionCompany, 10);
        const clientId = parseInt(clientName, 10);
        const projectManagerId = parseInt(projectManager, 10);
        const projectNumberInt = projectNumber ? parseInt(projectNumber, 10) : 1000;

        // Validate required fields
        if (
            isNaN(productionCompanyId) || 
            isNaN(clientId) || 
            isNaN(projectManagerId) || 
            !projectName || 
            !startDate || 
            !endDate || 
            !status
        ) {
            return new Response(JSON.stringify({ error: "Invalid or missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Create a new project and link existing relations
        const newProject = await prisma.projects.create({
            data: {
                projectName,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status,
                projectNumber: projectNumberInt,
                productionCompanies: {
                    create: [{ productionCompany: { connect: { id: productionCompanyId } } }]
                },
                clients: {
                    create: [{ client: { connect: { id: clientId } } }]
                },
                projectManagers: {
                    create: [{ projectManager: { connect: { id: projectManagerId } } }]
                }
            },
            include: {
                productionCompanies: { include: { productionCompany: true } },
                clients: { include: { client: true } },
                projectManagers: { include: { projectManager: true } }
            }
        });

        console.log("New Project:", newProject);

        return new Response(JSON.stringify({ data: newProject }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error creating project:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    } finally {
        await prisma.$disconnect();
    }
}
