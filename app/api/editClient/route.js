import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req) {
    try {
        const body = await req.json();
        console.log("Request Body:", body);

        let {
            id, // Correct extraction of client ID
            firstName,
            lastName,
            email,
            phone,
            streetAddress,
            streetAddress2,
            city,
            state,
            zip,
            contactPersonFirst,
            contactPersonLast,
            note,
        } = body;

        // Convert id to integer if valid
        const clientId = id ? parseInt(id) : null;

        if (!clientId || isNaN(clientId)) {
            return new Response(JSON.stringify({ error: "Invalid or missing client ID" }), { status: 400 });
        }

        // Find the existing client
        const existingClient = await prisma.clients.findUnique({
            where: { id: clientId },
        });

        if (!existingClient) {
            return new Response(JSON.stringify({ error: "Client not found" }), { status: 404 });
        }

        // Ensure email is unique if changed
        if (email && email !== existingClient.email) {
            const emailExists = await prisma.clients.findUnique({ where: { email } });
            if (emailExists) {
                return new Response(JSON.stringify({ error: "Email already in use" }), { status: 400 });
            }
        }

        // Update the Client
        const updatedClient = await prisma.clients.update({
            where: { id: clientId },
            data: {
                firstName,
                lastName,
                email,
                phone,
                streetAddress,
                streetAddress2,
                city,
                state,
                zip,
                contactPersonFirst,
                contactPersonLast,
                note,
            },
        });

        // Fetch the updated client with related projects (Fixing the include syntax)
        const formattedClient = await prisma.clients.findUnique({
            where: { id: clientId },
            include: {
                projects: {
                    include: {
                        project: { // Correctly reference the Project model
                            select: {
                                id: true,
                                projectName: true,
                                status: true,
                            },
                        },
                    },
                },
            },
        });

        return new Response(JSON.stringify({ data: formattedClient }), { status: 200 });

    } catch (error) {
        console.error("Error updating client:", error);
        return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
