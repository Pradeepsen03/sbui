import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
    try {
        const body = await req.json();
        const { 
            id, // Required for updating
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
            projectIds = [] // Ensure it's always an array
        } = body;

        // Convert IDs to integers
        const crewMemberId = parseInt(id, 10);
        const projectManagerIdInt = projectManagerId ? parseInt(projectManagerId, 10) : null;
        const projectIdsInt = projectIds.map((projectId) => parseInt(projectId, 10));

        // Check if crew member exists
        const existingCrewMember = await prisma.crewMembers.findUnique({
            where: { id: crewMemberId },
            include: { projects: true }
        });

        if (!existingCrewMember) {
            return new Response(JSON.stringify({ error: "Crew Member not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Update the Crew Member
        const updatedCrewMember = await prisma.crewMembers.update({
            where: { id: crewMemberId },
            data: {
                firstName: firstName ?? existingCrewMember.firstName,
                lastName: lastName ?? existingCrewMember.lastName,
                rolePosition: rolePosition ?? existingCrewMember.rolePosition,
                email: email ?? existingCrewMember.email,
                phone: phone ?? existingCrewMember.phone,
                streetAddress: streetAddress ?? existingCrewMember.streetAddress,
                streetAddress2: streetAddress2 ?? existingCrewMember.streetAddress2,
                city: city ?? existingCrewMember.city,
                state: state ?? existingCrewMember.state,
                zip: zip ?? existingCrewMember.zip,
                projectManagerId: projectManagerIdInt,

           
            },
            include: {
                projectManager: true,
                projects: true
            }
        });

        console.log("Updated CrewMember:", updatedCrewMember);

        return new Response(JSON.stringify({ data: updatedCrewMember }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error updating CrewMember:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    } finally {
        await prisma.$disconnect();
    }
}
