import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id, // Equipment ID to update
            name,
            type,
            location,
            streetAddress,
            streetAddress2,
            city,
            state,
            zip,
            crewMemberId, // Optional crew member assignment
        } = body;

        // Validate required fields
        if (!id) {
            return new Response(JSON.stringify({ error: "Equipment ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Convert crewMemberId to integer if provided
        const crewMemberIdInt = crewMemberId ? parseInt(crewMemberId, 10) : null;

        // Check if equipment exists
        const existingEquipment = await prisma.equipments.findUnique({ where: { id: parseInt(id, 10) } });
        if (!existingEquipment) {
            return new Response(JSON.stringify({ error: "Equipment not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Update the equipment
        const updatedEquipment = await prisma.equipments.update({
            where: { id: parseInt(id, 10) },
            data: {
                name: name || existingEquipment.name,
                type: type || existingEquipment.type,
                location: location || existingEquipment.location,
                streetAddress: streetAddress !== undefined ? streetAddress : existingEquipment.streetAddress,
                streetAddress2: streetAddress2 !== undefined ? streetAddress2 : existingEquipment.streetAddress2,
                city: city !== undefined ? city : existingEquipment.city,
                state: state !== undefined ? state : existingEquipment.state,
                zip: zip !== undefined ? zip : existingEquipment.zip,
                crewMemberId: crewMemberIdInt !== undefined ? crewMemberIdInt : existingEquipment.crewMemberId,
            },
            include: {
                crewMember: true, // Include updated crew member details
            },
        });

        return new Response(JSON.stringify({ data: updatedEquipment }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating equipment:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        await prisma.$disconnect();
    }
}
