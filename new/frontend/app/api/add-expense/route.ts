import { NextResponse } from "next/server"

// In-memory storage for expenses
const expenses = new Map()

function getKey(giver: string, receiver: string) {
  return `${giver}|${receiver}`
}

function addToExpenses(giver: string, receiver: string, amount: number) {
  const key = getKey(giver, receiver)
  const existing = expenses.get(key) || []
  expenses.set(key, [...existing, amount])
}

export async function POST(request: Request) {
  try {
    const { userId, amount, sharedWith, description } = await request.json()

    if (!userId || !amount || !Array.isArray(sharedWith)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const totalPeople = 1 + sharedWith.length
    const amountPerPerson = amount / totalPeople

    // Add expense for self
    addToExpenses(userId, userId, amountPerPerson)

    // Add expense for others
    for (const otherId of sharedWith) {
      addToExpenses(userId, otherId, amountPerPerson)
    }

    return NextResponse.json({ message: "Expense added successfully" })
  } catch (error) {
    console.error("Error adding expense:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
