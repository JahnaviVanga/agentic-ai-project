import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Sending data to backend:", body)

    const response = await fetch("http://127.0.0.1:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Backend error:", errorText)
      return NextResponse.json({ error: `Backend error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Backend returned:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API proxy error:", error)
    return NextResponse.json(
      {
        error: "Failed to connect to backend. Make sure the backend server is running at http://127.0.0.1:5000",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
