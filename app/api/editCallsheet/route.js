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
            projectId
        } = body;

        // Convert id and projectId to numbers
        const callSheetId = id ? parseInt(id, 10) : null;
        const projectIDNum = projectId ? parseInt(projectId, 10) : null;

        if (!callSheetId || isNaN(callSheetId)) {
            return new Response(JSON.stringify({ error: "Invalid or missing CallSheet ID" }), { status: 400 });
        }

        if (projectId && isNaN(projectIDNum)) {
            return new Response(JSON.stringify({ error: "Invalid Project ID" }), { status: 400 });
        }

        // Check if the CallSheet exists
        const existingCallSheet = await prisma.callSheets.findUnique({
            where: { id: callSheetId },
        });

        if (!existingCallSheet) {
            return new Response(JSON.stringify({ error: "CallSheet not found" }), { status: 404 });
        }

        // Convert dates to ISO 8601 format
        const callSheetDateISO = callSheetDate ? new Date(callSheetDate).toISOString() : existingCallSheet.callSheetDate;
        const startTimeISO = startTime ? new Date(`${callSheetDate}T${startTime}`).toISOString() : existingCallSheet.startTime;
        const endTimeISO = endTime ? new Date(`${callSheetDate}T${endTime}`).toISOString() : existingCallSheet.endTime;

        // Update the CallSheet
        const updatedCallSheet = await prisma.callSheets.update({
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
                projectId: projectIDNum // Ensure projectId is a number
            },
        });

        // Fetch the updated CallSheet with related project
        const formattedCallSheet = await prisma.callSheets.findUnique({
            where: { id: callSheetId },
            include: {
                project: {
                    select: {
                        id: true,
                        projectName: true,
                        status: true,
                    },
                },
            },
        });

        console.log("Updated CallSheet:", formattedCallSheet);

        return new Response(JSON.stringify({ data: formattedCallSheet }), { status: 200 });

    } catch (error) {
        console.error("Error updating CallSheet:", error);
        return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
