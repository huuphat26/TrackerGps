import { api } from "../index"
import { AuthService } from "./AuthService"

// Mock the api singleton
jest.mock("../index", () => ({
  api: {
    post: jest.fn(),
  },
}))

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call api.post with correct params for register", async () => {
    const payload = {
      name: "phathn268",
      email: "phathn2688@gmail.com",
      password: "password123",
    }
    const mockResponse = {
      data: {
        message: "User created successfully",
        user: {
          id: "7d2467a4-fe29-424d-8d3d-18a5de5b6d3b",
          name: "phathn268",
          email: "phathn2688@gmail.com",
        },
      },
      statusCode: 201,
      timestamp: "2026-02-06T06:25:03.939Z",
    }

    ;(api.post as jest.Mock).mockResolvedValue(mockResponse)

    const result = await AuthService.register(payload)

    expect(api.post).toHaveBeenCalledWith("/api/auth/register", payload)
    expect(result).toEqual(mockResponse)
  })

  it("should call api.post with correct params for login", async () => {
    const payload = {
      email: "huuphat263@gmail.com",
      password: "Admin@123",
    }
    const mockResponse = {
      data: {
        message: "Login successful",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      statusCode: 201,
      timestamp: "2026-02-06T06:20:13.834Z",
    }

    ;(api.post as jest.Mock).mockResolvedValue(mockResponse)

    const result = await AuthService.login(payload)

    expect(api.post).toHaveBeenCalledWith("/api/auth/login", payload)
    expect(result).toEqual(mockResponse)
  })
})
