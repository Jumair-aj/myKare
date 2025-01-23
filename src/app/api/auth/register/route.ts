import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/schema/userModule";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      // Determine which field is duplicate
      if (existingUser.email === email) {
        return NextResponse.json({
          error: "Email already exists",
          field: "email"
        }, { status: 400 });
      }

      if (existingUser.username === username) {
        return NextResponse.json({
          error: "Username already exists",
          field: "username"
        }, { status: 400 });
      }
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // const verificationToken = await bcryptjs.hash(savedUser._id.toString(), 10);
    // const templateName = "verification_template.html";
    // const subject = "Email Verification";
    // await sendEmail(email, subject, { verificationLink: `${process.env.DOMAIN}/verifyemail?token=${verificationToken}` }, templateName);

    return NextResponse.json({
      message: "User created successfully.",
      success: true,
      savedUser
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    else {

    }
  }
}