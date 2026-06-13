import { NextRequest, NextResponse } from "next/server";
import { getSignalById } from "@/lib/signals";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const signal = await getSignalById(params.id);
  if (!signal) {
    return NextResponse.json({ error: "Signal not found" }, { status: 404 });
  }
  return NextResponse.json({ signal });
}
