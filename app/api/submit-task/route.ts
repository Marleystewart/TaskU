import { NextResponse } from "next/server";

const fallbackSheetId = "1kMOnd3HZz3WOLbiCDAsfe27E6z6bNtEP9iOu7FqYJos";
const fallbackSheetBestUrl = `https://api.sheetbest.com/sheets/${fallbackSheetId}`;

type TaskSubmission = {
  name?: string;
  taskDescription?: string;
  location?: string;
  timeNeeded?: string;
  contact?: string;
  price?: string;
  paid?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const sheetBestUrl = process.env.SHEET_BEST_API_URL ?? fallbackSheetBestUrl;

  try {
    const submission = (await request.json()) as TaskSubmission;
    const payload = {
      Name: submission.name ?? "",
      "Task Description": submission.taskDescription ?? "",
      Location: submission.location ?? "",
      "Time Needed": submission.timeNeeded ?? "",
      Contact: submission.contact ?? "",
      Price: submission.price ?? "",
      Paid: submission.paid ?? "No",
    };

    const response = await fetch(sheetBestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error("Sheet.best task submission failed", {
        status: response.status,
        response: responseText,
      });

      return NextResponse.json(
        { error: "Could not submit task. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Task submission failed", error);
    return NextResponse.json(
      { error: "Could not submit task. Please try again." },
      { status: 500 },
    );
  }
}
