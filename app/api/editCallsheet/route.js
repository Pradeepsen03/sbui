import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req) {
    try {
        const body = await req.json();
        console.log("Request Body:", body);

        let {
            id, // CallSheet ID
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
        } = body;

        // Convert id to integer
        const callSheetId = id ? parseInt(id, 10) : null;

        if (!callSheetId || isNaN(callSheetId)) {
            return new Response(JSON.stringify({ error: "Invalid or missing CallSheet ID" }), { status: 400 });
        }

        // Check if the CallSheet exists
        const existingCallSheet = await prisma.callSheet.findUnique({
            where: { id: callSheetId },
        });

        if (!existingCallSheet) {
            return new Response(JSON.stringify({ error: "CallSheet not found" }), { status: 404 });
        }

        // Convert callSheetDate, startTime, and endTime to ISO 8601 format
        const callSheetDateISO = callSheetDate ? new Date(callSheetDate).toISOString() : existingCallSheet.callSheetDate;
        const startTimeISO = startTime ? new Date(`${callSheetDate}T${startTime}`).toISOString() : existingCallSheet.startTime;
        const endTimeISO = endTime ? new Date(`${callSheetDate}T${endTime}`).toISOString() : existingCallSheet.endTime;

        // Update the CallSheet
        const updatedCallSheet = await prisma.callSheet.update({
            where: { id: callSheetId },
            data: {
                callSheetDate: callSheetDateISO,
                shootLocation,
                streetAddress,
                streetAddress2,
                city,
                state,
                zip,
                startTime: startTimeISO,
                endTime: endTimeISO,
                parkingNotes,
            },
        });

        // Fetch the updated CallSheet with related project
        const formattedCallSheet = await prisma.callSheet.findUnique({
            where: { id: callSheetId },
            include: {
                project: { // Include project details
                    select: {
                        id: true,
                        projectName: true,
                        status: true,
                    },
                },
            },
        });

        return new Response(JSON.stringify({ data: formattedCallSheet }), { status: 200 });

    } catch (error) {
        console.error("Error updating CallSheet:", error);
        return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
