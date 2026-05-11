import { NextResponse } from "next/server";

type TaskSubmission = {
  taskDescription?: string;
  location?: string;
  timeNeeded?: string;
  contact?: string;
  price?: string;
  paid?: string;
  "Task Description"?: string;
  Location?: string;
  "Time Needed"?: string;
  Contact?: string;
  Price?: string;
  Paid?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const sheetBestUrl = process.env.SHEET_BEST_API_URL;
  const sheetBestApiKey = process.env.SHEET_BEST_API_KEY;

  if (!sheetBestUrl) {
    const message = "Sheet.best endpoint is not configured. Set SHEET_BEST_API_URL to your Sheet.best API URL.";
    console.error("Sheet.best endpoint missing", { hasSheetBestUrl: false });
    return NextResponse.json({ error: message }, { status: 500 });
  }

  try {
    const submission = (await request.json()) as TaskSubmission;
    const payload = {
      "Task Description": submission["Task Description"] ?? submission.taskDescription ?? "",
      Location: submission.Location ?? submission.location ?? "",
      "Time Needed": submission["Time Needed"] ?? submission.timeNeeded ?? "",
      Contact: submission.Contact ?? submission.contact ?? "",
      Price: submission.Price ?? submission.price ?? "",
      Paid: submission.Paid ?? submission.paid ?? "No",
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (sheetBestApiKey) {
      headers["X-Api-Key"] = sheetBestApiKey;
    }

    const response = await fetch(sheetBestUrl, {
      method: "POST",
      headers,
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
