import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Here you would persist the order to your database / external service
    // For now, we echo back a mock orderId
    const orderId = `KW-${Date.now()}`
    return NextResponse.json({ orderId }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }
}


