import { NextRequest } from "next/server";
import { POST } from "../../app/api/auth/login/route";
import User from "../../schema/userModule";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Mock dependencies
jest.mock("../../../../schema/userModule");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../../dbconfig/dbconfig", () => ({
  connect: jest.fn(),
}));

describe("Login API Route", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Set up environment variable
    process.env.TOKEN_SECRET = "test_secret";
  });

  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    username: "testuser",
    email: "test@example.com",
    password: "hashedpassword",
  };

  it("should successfully login with email", async () => {
    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    
    // Mock bcryptjs.compare to return true (password matches)
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

    // Mock JWT sign
    (jwt.sign as jest.Mock).mockReturnValue("mock_token");

    // Simulate the mock request with email
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        emailOrUsername: "test@example.com",
        password: "correctpassword",
      }),
    } as unknown as NextRequest;

    // Call the POST function with the mock request
    const response = await POST(mockRequest);

    expect(response).toBeDefined();
    expect(response.status).toBe(200); // Success status

    const responseBody = await response.json();
    expect(responseBody.message).toBe("Login successful");
    expect(responseBody.success).toBe(true);
    expect(responseBody.user.username).toBe(mockUser.username);
    expect(responseBody.user.email).toBe(mockUser.email);
    expect(responseBody.user._id).toBe(mockUser._id.toString());
    expect(response.cookies.get("token")).toBe("mock_token");
  });

  it("should successfully login with username", async () => {
    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    // Mock bcryptjs.compare to return true (password matches)
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

    // Mock JWT sign
    (jwt.sign as jest.Mock).mockReturnValue("mock_token");

    // Simulate the mock request with username
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        emailOrUsername: "testuser",
        password: "correctpassword",
      }),
    } as unknown as NextRequest;

    // Call the POST function with the mock request
    const response = await POST(mockRequest);

    expect(response).toBeDefined();
    expect(response.status).toBe(200); // Success status

    const responseBody = await response.json();
    expect(responseBody.message).toBe("Login successful");
    expect(responseBody.success).toBe(true);
    expect(responseBody.user.username).toBe(mockUser.username);
    expect(responseBody.user.email).toBe(mockUser.email);
    expect(responseBody.user._id).toBe(mockUser._id.toString());
    expect(response.cookies.get("token")).toBe("mock_token");
  });

  it("should return error for non-existent user", async () => {
    // Mock User.findOne to return null (user not found)
    (User.findOne as jest.Mock).mockResolvedValue(null);

    // Simulate the mock request with email
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        emailOrUsername: "nonexistent@example.com",
        password: "anypassword",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);

    expect(response).toBeDefined();
    expect(response.status).toBe(400); // Error status

    const responseBody = await response.json();
    expect(responseBody.error).toBe("User does not exist");
  });

  it("should return error for invalid password", async () => {
    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    // Mock bcryptjs.compare to return false (invalid password)
    (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

    // Simulate the mock request with correct email and wrong password
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        emailOrUsername: "test@example.com",
        password: "wrongpassword",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);

    expect(response).toBeDefined();
    expect(response.status).toBe(400); // Error status

    const responseBody = await response.json();
    expect(responseBody.error).toBe("Invalid password");
  });

  it("should handle unexpected errors", async () => {
    // Mock User.findOne to throw an error (unexpected error)
    (User.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));

    // Simulate the mock request with email
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        emailOrUsername: "test@example.com",
        password: "anypassword",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);

    expect(response).toBeDefined();
    expect(response.status).toBe(500); // Server error status

    const responseBody = await response.json();
    expect(responseBody.error).toBe("Database error");
  });
});
