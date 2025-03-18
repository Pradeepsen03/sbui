import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const projects = await prisma.project.findMany({
            include: {
                productionCompanies: {
                    select: {
                        productionCompanyId: true,
                        productionCompany: { select: { name: true } } // Get Production Company Name
                    }
                },
                clients: {
                    select: {
                        clientId: true,
                        client: { 
                            select: { 
                                firstName: true, 
                                lastName: true 
                            } 
                        } // Get Client's Full Name
                    }
                },
                projectManagers: {
                    select: {
                        projectManagerId: true,
                        projectManager: { 
                            select: { 
                                firstName: true, 
                                lastName: true 
                            } 
                        } // Get Project Manager's Full Name
                    }
                },
            }
        });

        if (projects.length === 0) {
            return new Response(JSON.stringify({ error: "No project found" }), { 
                status: 404, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        // Transform data to include full names
        const formattedProjects = projects.map(project => ({
            id: project.id,
            projectName: project.projectName,
            startDate: project.startDate,
            endDate: project.endDate,
            status: project.status,
            projectNumber: project.projectNumber,
            productionCompanies: project.productionCompanies.map(pc => ({
                id: pc.productionCompanyId,
                name: pc.productionCompany.name
            })), 
            clients: project.clients.map(c => ({
                id: c.clientId,
                fullName: `${c.client.firstName} ${c.client.lastName}`
            })),
            projectManagers: project.projectManagers.map(pm => ({
                id: pm.projectManagerId,
                fullName: `${pm.projectManager.firstName} ${pm.projectManager.lastName}`
            })),
        }));

        console.log("Formatted Projects:", formattedProjects);

        return new Response(JSON.stringify({ data: formattedProjects }), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });

    } catch (error) {
        console.error("Error fetching projects:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    } finally {
        await prisma.$disconnect();
    }
}
