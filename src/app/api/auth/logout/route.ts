import { NextResponse } from "next/server";

export async function GET() {
    try {
        const reqest = await NextResponse.json({
            message: "logout successfully",
            success: true
        })

        reqest.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

        return reqest

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        else {

        }
    }
}