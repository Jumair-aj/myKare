// __tests__/logout.test.ts
import { GET } from "../../app/api/auth/logout/route";
import { NextResponse } from "next/server";

jest.mock("next/server", () => {
  return {
    NextResponse: {
      json: jest.fn(),
    },
  };
});

describe("GET function", () => {
  it("should return a success response and set the token cookie", async () => {
    // Mock NextResponse.json
    const jsonMock = jest.fn().mockImplementation((body) => ({
      jsonBody: body,
      cookies: {
        set: jest.fn(),
      },
    }));

    (NextResponse.json as jest.Mock).mockImplementation(jsonMock);

    // Call the GET function
    const response = await GET();

    // Assertions
    expect(NextResponse.json).toHaveBeenCalledWith({
      message: "logout successfully",
      success: true,
    });

    const cookiesSetMock = jsonMock.mock.results[0].value.cookies.set;
    expect(cookiesSetMock).toHaveBeenCalledWith("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    // Ensure the response structure matches what we mocked
    expect(response).toEqual({
      jsonBody: {
        message: "logout successfully",
        success: true,
      },
      cookies: expect.any(Object),
    });
  });

  it("should handle errors gracefully", async () => {
    // Simulate an error by throwing inside NextResponse.json
    (NextResponse.json as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Something went wrong");
    });

    const response = await GET();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Something went wrong" },
      { status: 500 }
    );

    expect(response).toEqual({
      error: "Something went wrong",
      status: 500,
    });
  });
});
