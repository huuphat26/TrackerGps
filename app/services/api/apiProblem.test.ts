import { getGeneralApiProblem } from "./apiProblem"
import { ApiResponse } from "apisauce"

describe("getGeneralApiProblem", () => {
  test("handles connection error", () => {
    const response: ApiResponse<any> = {
      problem: "CONNECTION_ERROR",
      ok: false,
      data: null,
      status: null,
      headers: {},
      config: {},
      duration: 0,
      originalError: null,
    }
    expect(getGeneralApiProblem(response)).toEqual({ kind: "cannot-connect", temporary: true })
  })

  test("handles 400 Bad Request (Validation)", () => {
    const response: ApiResponse<any> = {
      problem: "CLIENT_ERROR",
      ok: false,
      status: 400,
      data: {
        statusCode: 400,
        message: ["email must be an email"],
        error: "Bad Request",
      },
      headers: {},
      config: {},
      duration: 0,
      originalError: null,
    }
    expect(getGeneralApiProblem(response)).toEqual({
      kind: "server",
      data: {
        statusCode: 400,
        message: ["email must be an email"],
        error: "Bad Request",
      },
    })
  })

  test("handles 401 Unauthorized", () => {
    const response: ApiResponse<any> = {
      problem: "CLIENT_ERROR",
      ok: false,
      status: 401,
      data: { message: "Unauthorized" },
      headers: {},
      config: {},
      duration: 0,
      originalError: null,
    }
    expect(getGeneralApiProblem(response)).toEqual({ kind: "unauthorized" })
  })

  test("handles 404 Not Found", () => {
    const response: ApiResponse<any> = {
      problem: "CLIENT_ERROR",
      ok: false,
      status: 404,
      data: { message: "Device not found" },
      headers: {},
      config: {},
      duration: 0,
      originalError: null,
    }
    expect(getGeneralApiProblem(response)).toEqual({ kind: "not-found" })
  })

  test("handles 409 Conflict", () => {
    const response: ApiResponse<any> = {
      problem: "CLIENT_ERROR",
      ok: false,
      status: 409,
      data: {
        statusCode: 409,
        message: "Device already registered",
        error: "Conflict",
      },
      headers: {},
      config: {},
      duration: 0,
      originalError: null,
    }
    expect(getGeneralApiProblem(response)).toEqual({
      kind: "server",
      data: {
        statusCode: 409,
        message: "Device already registered",
        error: "Conflict",
      },
    })
  })

  test("handles 500 Server Error", () => {
    const response: ApiResponse<any> = {
      problem: "SERVER_ERROR",
      ok: false,
      status: 500,
      data: { message: "Internal Server Error" },
      headers: {},
      config: {},
      duration: 0,
      originalError: null,
    }
    expect(getGeneralApiProblem(response)).toEqual({
      kind: "server",
      data: { message: "Internal Server Error" },
    })
  })
})
