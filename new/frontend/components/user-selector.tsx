"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from "lucide-react"

interface UserSelectorProps {
  onUserChange: (userId: string) => void
}

export default function UserSelector({ onUserChange }: UserSelectorProps) {
  const [users, setUsers] = useState<string[]>(["user1", "user2", "user3"])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [newUser, setNewUser] = useState<string>("")

  const handleUserSelect = (value: string) => {
    setSelectedUser(value)
    onUserChange(value)
  }

  const handleAddUser = () => {
    if (newUser && !users.includes(newUser)) {
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      setSelectedUser(newUser)
      onUserChange(newUser)
      setNewUser("")
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Select User</CardTitle>
        <CardDescription>Choose your identity or add a new user</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Select value={selectedUser} onValueChange={handleUserSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 w-full">
            <Input
              placeholder="Add new user"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddUser} type="button">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
