import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            name,
            type,
            location,
            streetAddress,
            streetAddress2,
            city,
            state,
            zip,
            crewMemberId // Optional: ID of the crew member assigned to this equipment
        } = body;

        // Convert crewMemberId to integer if provided
        const crewMemberIdInt = crewMemberId ? parseInt(crewMemberId, 10) : null;

        // Validate required fields
        if (!name || !type || !location) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Create a new Equipment entry
        const newEquipment = await prisma.equipments.create({
            data: {
                name,
                type,
                location,
                streetAddress: streetAddress || null,
                streetAddress2: streetAddress2 || null,
                city: city || null,
                state: state || null,
                zip: zip || null,
                crewMemberId: crewMemberIdInt
            },
            include: {
                crewMember: true // Include related crew member details if assigned
            }
        });

        console.log("New Equipment:", newEquipment);

        return new Response(JSON.stringify({ data: newEquipment }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error creating Equipment:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    } finally {
        await prisma.$disconnect();
    }
}