"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface User {
  id: string
  email: string
  tokens: number
  created_at: string
}

export default function AdminPanel() {
  const { supabase, session } = useSupabase()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ email: "", password: "" })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userStats, setUserStats] = useState({ totalUsers: 0, totalTokens: 0 })

  useEffect(() => {
    if (!session) {
      router.push("/login")
    } else {
      checkAdminStatus()
      fetchUsers()
      fetchUserStats()
    }
  }, [session, router])

  const checkAdminStatus = async () => {
    const { data, error } = await supabase.from("users").select("is_admin").eq("id", session?.user.id).single()

    if (error || !data?.is_admin) {
      router.push("/dashboard")
    }
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*")
    if (error) {
      console.error("Error fetching users:", error)
    } else {
      setUsers(data)
    }
    setLoading(false)
  }

  const fetchUserStats = async () => {
    const { data, error } = await supabase.from("users").select("id, tokens")

    if (error) {
      console.error("Error fetching user stats:", error)
    } else {
      const totalUsers = data.length
      const totalTokens = data.reduce((sum, user) => sum + (user.tokens || 0), 0)
      setUserStats({ totalUsers, totalTokens })
    }
  }

  const createUser = async () => {
    const { data, error } = await supabase.auth.admin.createUser({
      email: newUser.email,
      password: newUser.password,
      email_confirm: true,
    })

    if (error) {
      console.error("Error creating user:", error)
    } else {
      await supabase.from("users").insert({ id: data.user.id, email: data.user.email, tokens: 0 })
      fetchUsers()
      setNewUser({ email: "", password: "" })
    }
  }

  const updateUser = async () => {
    if (!editingUser) return

    const { error } = await supabase
      .from("users")
      .update({ email: editingUser.email, tokens: editingUser.tokens })
      .eq("id", editingUser.id)

    if (error) {
      console.error("Error updating user:", error)
    } else {
      fetchUsers()
      setEditingUser(null)
    }
  }

  const deleteUser = async (id: string) => {
    const { error } = await supabase.auth.admin.deleteUser(id)

    if (error) {
      console.error("Error deleting user:", error)
    } else {
      await supabase.from("users").delete().eq("id", id)
      fetchUsers()
    }
  }

  const chartData = {
    labels: users.map((user) => user.email),
    datasets: [
      {
        label: "User Tokens",
        data: users.map((user) => user.tokens),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{userStats.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{userStats.totalTokens}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Token Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={chartData} />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={createUser}>Create User</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Tokens</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.tokens}</TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="mr-2">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="edit-email"
                          value={editingUser?.email}
                          onChange={(e) => setEditingUser({ ...editingUser!, email: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-tokens" className="text-right">
                          Tokens
                        </Label>
                        <Input
                          id="edit-tokens"
                          type="number"
                          value={editingUser?.tokens}
                          onChange={(e) => setEditingUser({ ...editingUser!, tokens: Number.parseInt(e.target.value) })}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button onClick={updateUser}>Update User</Button>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="icon" onClick={() => deleteUser(user.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

