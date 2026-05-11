import { NextResponse } from "next/server";

type TaskSubmission = {
  name?: string;
  taskDescription?: string;
  location?: string;
  timeNeeded?: string;
  contact?: string;
  price?: string;
  paid?: string;
  Name?: string;
  "Task Description"?: string;
  Location?: string;
  "Time Needed"?: string;
  Contact?: string;
  Price?: string;
  Paid?: string;
  "Paid (Yes or No)"?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const sheetBestUrl = process.env.SHEET_BEST_API_URL;

  if (!sheetBestUrl) {
    const message = "Sheet.best endpoint is not configured. Set SHEET_BEST_API_URL to your Sheet.best API URL.";
    console.error("Sheet.best endpoint missing", { hasSheetBestUrl: false });
    return NextResponse.json({ error: message }, { status: 500 });
  }

  try {
    const submission = (await request.json()) as TaskSubmission;
    console.log("REQ BODY:", submission);

    const name = submission.Name ?? submission.name ?? "";
    const taskDescription = submission.taskDescription ?? submission["Task Description"] ?? "";
    const location = submission.Location ?? submission.location ?? "";
    const timeNeeded = submission["Time Needed"] ?? submission.timeNeeded ?? "";
    const contact = submission.Contact ?? submission.contact ?? "";
    const price = submission.Price ?? submission.price ?? "";

    console.log("Received taskDescription from request body", {
      taskDescription: submission.taskDescription,
    });

    if (!taskDescription.trim()) {
      console.error("Task Description is empty before Sheet.best submit", {
        submission,
      });
      return NextResponse.json(
        { error: "Task Description is required before submitting." },
        { status: 400 },
      );
    }

    const payload = {
      "Name": name || "",
      "Task Description": taskDescription || "",
      "Location": location || "",
      "Time Needed": timeNeeded || "",
      "Contact": contact || "",
      "Price": price || "",
      "Paid (Yes or No)": "Yes",
    };

    console.log("SENDING TO SHEET:", payload);

    const response = await fetch(sheetBestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseText = await response.text();
      const upstreamMessage = responseText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      const message = `Sheet.best error (${response.status}): ${upstreamMessage || response.statusText}`;

      console.error("Sheet.best task submission failed", {
        url: sheetBestUrl,
        status: response.status,
        statusText: response.statusText,
        payload,
        response: responseText,
      });

      return NextResponse.json(
        { error: message },
        { status: 500 },
      );
    }

    const responseText = await response.text();
    console.log("Sheet.best task submission accepted", {
      status: response.status,
      response: responseText,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Task submission failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not submit task. Please try again." },
      { status: 500 },
    );
  }
}
