import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId parameter is required" }, { status: 400 })
    }

    console.log("[v0] Fetching advice for user:", userId)

    const response = await fetch(`http://127.0.0.1:5000/api/advice/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Advice response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Advice error:", errorText)
      return NextResponse.json({ error: `Failed to fetch advice: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Advice returned:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Advice API proxy error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch advice from backend",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
