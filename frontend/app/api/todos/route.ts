import { NextResponse } from "next/server";

const notImplemented = () =>
  NextResponse.json(
    { detail: "Todo API proxy is not implemented yet." },
    { status: 501 },
  );

export const GET = notImplemented;
export const POST = notImplemented;
