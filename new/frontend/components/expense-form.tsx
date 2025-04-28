"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface ExpenseFormProps {
  userId: string
  onExpenseAdded: () => void
}
const backendUrl = 'https://blockchain-workshop.onrender.com';
export default function ExpenseForm({ userId, onExpenseAdded }: ExpenseFormProps) {
  const [description, setDescription] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [sharedWith, setSharedWith] = useState<string[]>([])
  const [availableUsers, setAvailableUsers] = useState<string[]>(["user1", "user2", "user3"])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description || !amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please provide a description and a valid amount.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("${backendUrl}/add-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: Number.parseFloat(amount),
          sharedWith: sharedWith.filter((id) => id !== userId),
          description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add expense")
      }

      toast({
        title: "Expense added",
        description: "Your expense has been recorded successfully.",
      })

      // Reset form
      setDescription("")
      setAmount("")
      setSharedWith([])

      // Notify parent component
      onExpenseAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUserToggle = (userId: string) => {
    setSharedWith((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  // Filter out current user from available users
  const otherUsers = availableUsers.filter((user) => user !== userId)

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
          <CardDescription>Record a new expense to share with others</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Dinner, Movie tickets, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Share With</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {otherUsers.map((user) => (
                <div key={user} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${user}`}
                    checked={sharedWith.includes(user)}
                    onCheckedChange={() => handleUserToggle(user)}
                  />
                  <Label htmlFor={`user-${user}`} className="cursor-pointer">
                    {user}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding..." : "Add Expense"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
