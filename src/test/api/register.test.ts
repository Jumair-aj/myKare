import { POST } from "../../app/api/auth/register/route";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "../../schema/userModule";

jest.mock("bcryptjs", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("../../schema/userModule", () => ({
  findOne: jest.fn(),
  prototype: {
    save: jest.fn(),
  },
}));

describe("POST /api/auth/register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user successfully", async () => {
    // Mock request data
    const reqBody = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(reqBody),
    } as unknown as NextRequest;

    // Mock bcryptjs
    (bcryptjs.genSalt as jest.Mock).mockResolvedValue("mockSalt");
    (bcryptjs.hash as jest.Mock).mockResolvedValue("mockHashedPassword");

    // Mock User.findOne and save
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const mockSave = jest.fn().mockResolvedValue({
      username: "testuser",
      email: "test@example.com",
    });
    (User.prototype.save as jest.Mock) = mockSave;

    // Call POST function
    const response = await POST(mockRequest);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({
      $or: [{ email: "test@example.com" }, { username: "testuser" }],
    });
    expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
    expect(bcryptjs.hash).toHaveBeenCalledWith("password123", "mockSalt");
    expect(mockSave).toHaveBeenCalled();
    expect(response).toEqual(
      NextResponse.json({
        message: "User created successfully.",
        success: true,
        savedUser: {
          username: "testuser",
          email: "test@example.com",
        },
      })
    );
  });

  it("should return an error if email already exists", async () => {
    const reqBody = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(reqBody),
    } as unknown as NextRequest;

    (User.findOne as jest.Mock).mockResolvedValue({ email: "test@example.com" });

    const response = await POST(mockRequest);

    expect(User.findOne).toHaveBeenCalledWith({
      $or: [{ email: "test@example.com" }, { username: "testuser" }],
    });
    expect(response).toEqual(
      NextResponse.json(
        {
          error: "Email already exists",
          field: "email",
        },
        { status: 400 }
      )
    );
  });

  it("should return an error if username already exists", async () => {
    const reqBody = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(reqBody),
    } as unknown as NextRequest;

    (User.findOne as jest.Mock).mockResolvedValue({ username: "testuser" });

    const response = await POST(mockRequest);

    expect(User.findOne).toHaveBeenCalledWith({
      $or: [{ email: "test@example.com" }, { username: "testuser" }],
    });
    expect(response).toEqual(
      NextResponse.json(
        {
          error: "Username already exists",
          field: "username",
        },
        { status: 400 }
      )
    );
  });

  it("should handle unexpected errors gracefully", async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error("Unexpected error")),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);

    expect(response).toEqual(
      NextResponse.json({ error: "Unexpected error" }, { status: 500 })
    );
  });
});
