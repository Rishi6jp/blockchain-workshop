"use client"


import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowUpCircle, AlertCircle } from "lucide-react"

interface Debt {
  owedTo: string
  amount: number
}

interface DebtSummaryProps {
  userId: string
}

const backendUrl = 'https://blockchain-workshop.onrender.com';

export default function DebtSummary({ userId }: DebtSummaryProps) {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${backendUrl}/debts?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch debts")
        }

        const data = await response.json()
        setDebts(data.debts || [])
        setError(null)
      } catch (error) {
        setError("Failed to load debt information. Please try again.")
        console.error("Error fetching debts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDebts()
  }, [userId])

  const totalOwed = debts.reduce((sum, debt) => sum + debt.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>What You Owe</CardTitle>
        <CardDescription>Summary of your debts to others</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : debts.length === 0 ? (
          <p className="text-center py-4">You don't owe anything to anyone.</p>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-lg font-semibold">Total: ${totalOwed.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
              {debts.map((debt, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <ArrowUpCircle className="h-5 w-5 text-red-500" />
                    <span>
                      You owe <strong>{debt.owedTo}</strong>
                    </span>
                  </div>
                  <span className="font-medium">${debt.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
