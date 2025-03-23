import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // This is a placeholder endpoint that doesn't actually connect to Twilio
  // It just returns a success response for front-end demo purposes
  return NextResponse.json({ success: true });
}
