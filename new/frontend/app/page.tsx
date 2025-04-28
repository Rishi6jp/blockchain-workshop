"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ExpenseForm from "@/components/expense-form"
import DebtSummary from "@/components/debt-summary"
import DebtorSummary from "@/components/debtor-summary"
import UserSelector from "@/components/user-selector"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<string>("")
  const [totalExpenses, setTotalExpenses] = useState<number>(0)

  useEffect(() => {
    if (currentUser) {
      fetchTotalExpenses()
    }
  }, [currentUser])

  const fetchTotalExpenses = async () => {
    try {
      const response = await fetch(`/api/expenses-total?userId=${currentUser}`)
      const data = await response.json()
      setTotalExpenses(data.total || 0)
    } catch (error) {
      console.error("Error fetching total expenses:", error)
    }
  }

  const handleUserChange = (userId: string) => {
    setCurrentUser(userId)
  }

  const handleExpenseAdded = () => {
    fetchTotalExpenses()
  }

  return (
    <main className="container mx-auto py-6 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Expense Sharing App</h1>

      <UserSelector onUserChange={handleUserChange} />

      {currentUser && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Expense Summary</CardTitle>
              <CardDescription>Your total expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="add-expense" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add-expense">Add Expense</TabsTrigger>
              <TabsTrigger value="debts">What You Owe</TabsTrigger>
              <TabsTrigger value="debtors">Who Owes You</TabsTrigger>
            </TabsList>

            <TabsContent value="add-expense">
              <ExpenseForm userId={currentUser} onExpenseAdded={handleExpenseAdded} />
            </TabsContent>

            <TabsContent value="debts">
              <DebtSummary userId={currentUser} />
            </TabsContent>

            <TabsContent value="debtors">
              <DebtorSummary userId={currentUser} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </main>
  )
}
