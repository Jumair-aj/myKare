import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../../schema/userModule";
import { connect } from "../../../../dbconfig/dbconfig";


connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { emailOrUsername, password } = reqBody;

    // Determine if input is an email or a username using regex
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername);

    // Find the user by email or username
    const user = await User.findOne(isEmail ? { email: emailOrUsername } : { username: emailOrUsername });
    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    // Validate the password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Generate JWT token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

    // Create the response with the token
    const response = NextResponse.json({
      user,
      message: "Login successful",
      success: true,
    });

    // Set token in cookies
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    else {

    }
  }
}
