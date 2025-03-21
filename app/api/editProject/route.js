import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req) {
    try {
        const body = await req.json();
        console.log("Request Body:", body);

        let {
            projectNumber,
            projectName,
            status,
            productionCompany,
            clientName,
            projectManager,
            projectId,
            startDate,
            endDate,
        } = body;

        // Convert to integers if valid
        projectNumber = projectNumber ? parseInt(projectNumber) : null;
        projectId = projectId ? parseInt(projectId) : null;
        productionCompany = productionCompany ? parseInt(productionCompany) : null;
        clientName = clientName ? parseInt(clientName) : null;
        projectManager = projectManager ? parseInt(projectManager) : null;

        // Convert date strings to Date objects
        const startDateTime = startDate ? new Date(startDate) : null;
        const endDateTime = endDate ? new Date(endDate) : null;

        if (isNaN(projectId)) {
            return new Response(JSON.stringify({ error: "Invalid projectId" }), { status: 400 });
        }

        // Find the existing project
        const existingProject = await prisma.projects.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
        }

        // Prepare update data
        const updateData = {
            projectName: projectName ?? existingProject.projectName,
            status: status ?? existingProject.status,
            projectNumber: projectNumber ?? existingProject.projectNumber,
            startDate: startDateTime ?? existingProject.startDate,
            endDate: endDateTime ?? existingProject.endDate,
        };

        // Update the Project
        const updatedProject = await prisma.projects.update({
            where: { id: projectId },
            data: updateData,
        });

        // Step 2: Update Production Companies (if provided)
        if (productionCompany) {
            await prisma.productionCompanyProjects.deleteMany({
                where: { projectId },
            });

            await prisma.productionCompanyProjects.create({
                data: {
                    projectId,
                    productionCompanyId: productionCompany,
                },
            });
        }

        // Step 3: Update Project Managers (if provided)
        if (projectManager) {
            await prisma.projectManagerProjects.deleteMany({
                where: { projectId },
            });

            await prisma.projectManagerProjects.create({
                data: {
                    projectId,
                    projectManagerId: projectManager,
                },
            });
        }

        // Step 4: Update Clients (if provided)
        if (clientName) {
            await prisma.clientProjects.deleteMany({
                where: { projectId },
            });

            await prisma.clientProjects.create({
                data: {
                    projectId,
                    clientId: clientName,
                },
            });
        }

        // Fetch the updated project with correct relations
        const formattedProject = await prisma.projects.findUnique({
            where: { id: projectId },
            include: {
                productionCompanies: {
                    select: {
                        productionCompany: { select: { id: true, name: true } },
                    },
                },
                projectManagers: {
                    select: {
                        projectManager: { select: { id: true, firstName: true, lastName: true } },
                    },
                },
                clients: {
                    select: {
                        client: { select: { id: true, firstName: true, lastName: true } },
                    },
                },
                callSheets: true, // This one is directly related to the project
            },
        });
        

        return new Response(JSON.stringify({ data: formattedProject }), { status: 200 });

    } catch (error) {
        console.error("Error updating project:", error);
        return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
