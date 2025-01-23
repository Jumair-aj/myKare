import { NextResponse } from "next/server";

export async function GET() {
    try {
        const reqest = await NextResponse.json({
            massage: "logout successfully",
            sucsee: true
        })

        reqest.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

        return reqest

    } catch (error) {
        return NextResponse.json({ massage: "your request is not complete" })
    }
}