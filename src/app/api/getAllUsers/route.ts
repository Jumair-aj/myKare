import { NextRequest, NextResponse } from "next/server";
import User from "@/schema/userModule";
import { connect } from "@/dbconfig/dbconfig";

connect();

export async function GET() {
  try {
    // Fetch all users from the database
    const users = await User.find();

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    // Return the list of users
    return NextResponse.json({
      users,
      message: "Users retrieved successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
