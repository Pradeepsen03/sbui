import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const crewMembers = await prisma.crewMembers.findMany({
            include: {
                projectManager: {  // FIX: Changed projectManagers → projectManager
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                projects: {
                    select: {
                        projectId: true,
                        project: { select: { projectName: true } }
                    }
                }
            }
        });

        if (crewMembers.length === 0) {
            return new Response(JSON.stringify({ error: "No crew members found" }), { 
                status: 404, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        // Transform data
        const formattedCrewMembers = crewMembers.map(member => ({
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            fullName: `${member.firstName} ${member.lastName}`,
            rolePosition: member.rolePosition,
            email: member.email,
            phone: member.phone,
            address: {
                streetAddress: member.streetAddress,
                streetAddress2: member.streetAddress2,
                city: member.city,
                state: member.state,
                zip: member.zip
            },
            projectManager: member.projectManager
                ? {
                    id: member.projectManager.id,
                    fullName: `${member.projectManager.firstName} ${member.projectManager.lastName}`
                }
                : null,
            projects: member.projects.map(p => ({
                id: p.projectId,
                name: p.project.projectName
            }))
        }));

        console.log("Formatted Crew Members:", formattedCrewMembers);

        return new Response(JSON.stringify({ data: formattedCrewMembers }), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });

    } catch (error) {
        console.error("Error fetching crew members:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    } finally {
        await prisma.$disconnect();
    }
}
