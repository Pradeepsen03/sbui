import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { 
            firstName, 
            lastName, 
            rolePosition, 
            email, 
            phone, 
            streetAddress, 
            streetAddress2, 
            city, 
            state, 
            zip, 
            projectManagerId, // Optional
            projectIds // Optional: Array of project IDs
        } = body;

        // Convert projectManagerId to integer if provided
        const projectManagerIdInt = projectManagerId ? parseInt(projectManagerId, 10) : null;

        // Validate required fields
        if (!firstName || !lastName || !rolePosition || !email) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Create a new CrewMember
        const newCrewMember = await prisma.crewMembers.create({
            data: {
                firstName,
                lastName,
                rolePosition,
                email,
                phone: phone || null,
                streetAddress: streetAddress || null,
                streetAddress2: streetAddress2 || null,
                city: city || null,
                state: state || null,
                zip: zip || null,
                projectManagerId: projectManagerIdInt,
                projects: projectIds?.length
                    ? {
                        create: projectIds.map((projectId) => ({
                            project: { connect: { id: parseInt(projectId, 10) } }
                        }))
                    }
                    : undefined
            },
            include: {
                projectManager: true,
                projects: { include: { project: true } }
            }
        });

        console.log("New CrewMember:", newCrewMember);

        return new Response(JSON.stringify({ data: newCrewMember }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error creating CrewMember:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    } finally {
        await prisma.$disconnect();
    }
}
