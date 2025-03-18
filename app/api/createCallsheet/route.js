import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { 
            callSheetDate, 
            shootLocation, 
            streetAddress, 
            streetAddress2, 
            city, 
            state, 
            zip, 
            startTime, 
            endTime, 
            parkingNotes, 
            projectId 
        } = body;

        // Convert projectId to integer
        const projectIdInt = parseInt(projectId, 10);

        // Validate required fields
        if (
            isNaN(projectIdInt) ||
            !callSheetDate ||
            !shootLocation ||
            !startTime ||
            !endTime
        ) {
            return new Response(JSON.stringify({ error: "Invalid or missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Convert callSheetDate, startTime, and endTime to ISO format
        const callSheetDateISO = new Date(callSheetDate).toISOString();
        const startTimeISO = new Date(`${callSheetDate}T${startTime}`).toISOString();
        const endTimeISO = new Date(`${callSheetDate}T${endTime}`).toISOString();

        // Create a new CallSheet
        const newCallSheet = await prisma.callSheets.create({  // ✅ Ensure `callSheets` matches Prisma's generated client
            data: {
                callSheetDate: callSheetDateISO,
                shootLocation,
                streetAddress: streetAddress || null,
                streetAddress2: streetAddress2 || null,
                city: city || null,
                state: state || null,
                zip: zip || null,
                startTime: startTimeISO,
                endTime: endTimeISO,
                parkingNotes: parkingNotes || null,
                projectId: projectIdInt
            },
            include: {
                project: true
            }
        });

        console.log("New CallSheet:", newCallSheet);

        return new Response(JSON.stringify({ data: newCallSheet }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error creating CallSheet:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    } finally {
        await prisma.$disconnect();
    }
}
