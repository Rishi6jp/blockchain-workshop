"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowDownCircle, AlertCircle } from "lucide-react"

interface Debtor {
  debtor: string
  amount: number
}

interface DebtorSummaryProps {
  userId: string
}

const backendUrl = 'https://blockchain-workshop.onrender.com';

export default function DebtorSummary({ userId }: DebtorSummaryProps) {
  const [debtors, setDebtors] = useState<Debtor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${backendUrl}/debtors?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch debtors")
        }

        const data = await response.json()
        setDebtors(data.debtors || [])
        setError(null)
      } catch (error) {
        setError("Failed to load debtor information. Please try again.")
        console.error("Error fetching debtors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDebtors()
  }, [userId])

  const totalOwed = debtors.reduce((sum, debtor) => sum + debtor.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who Owes You</CardTitle>
        <CardDescription>Summary of what others owe you</CardDescription>
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
        ) : debtors.length === 0 ? (
          <p className="text-center py-4">No one owes you anything.</p>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-lg font-semibold">Total: ${totalOwed.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
              {debtors.map((debtor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <ArrowDownCircle className="h-5 w-5 text-green-500" />
                    <span>
                      <strong>{debtor.debtor}</strong> owes you
                    </span>
                  </div>
                  <span className="font-medium">${debtor.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
