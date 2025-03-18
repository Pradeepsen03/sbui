import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received Client Data:", body);

    const {
      firstName,
      lastName,
      email,
      phone,
      address1,
      address2,
      city,
      state,
      zip,
      contactFirstName,
      contactLastName,
      note,
    } = body;

    // Validation
    if (!firstName || !lastName || !email) {
      return new Response(
        JSON.stringify({ error: "First name, last name, and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create Client
    const newClient = await prisma.clients.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        streetAddress:address1,
        streetAddress2:address2,
        city,
        state,
        zip,
        contactPersonFirst:contactFirstName,
        contactPersonLast:contactLastName,
        note,
      },
    });

    console.log("New Client Created:", newClient);

    return new Response(JSON.stringify({ data: newClient }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error creating client:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await prisma.$disconnect();
  }
}
