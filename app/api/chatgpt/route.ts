import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { question } = await req.json();
    try {
        console.log(question);
    } catch (error) {
        return NextResponse.json({ message: "something went wrong" });
    }
    return NextResponse.json({ message: "Message received" });
}
