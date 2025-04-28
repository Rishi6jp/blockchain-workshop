import { NextResponse } from "next/server"

// Access the shared expenses Map
const expenses = new Map()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const debts = []

    for (const [key, amounts] of expenses.entries()) {
      const [giver, receiver] = key.split("|")
      if (receiver === userId && giver !== receiver) {
        const totalAmount = amounts.reduce((sum: number, amt: number) => sum + amt, 0)
        debts.push({ owedTo: giver, amount: totalAmount })
      }
    }

    return NextResponse.json({ debts })
  } catch (error) {
    console.error("Error getting debts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
