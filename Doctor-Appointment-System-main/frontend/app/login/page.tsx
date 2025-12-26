"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Stethoscope } from "lucide-react"
import { Label } from "@/components/ui/label"
import { authAPI } from "@/lib/api"
import { setUser, getUser } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const user = getUser()
    if (user && user.role) {
      switch (user.role.toUpperCase()) {
        case "ADMIN":
          router.replace("/admin")
          break
        case "DOCTOR":
          router.replace("/doctor")
          break
        case "PATIENT":
          router.replace("/patient")
          break
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email || !password) {
        setError("Please enter both email and password")
        setLoading(false)
        return
      }

      // Call backend login API
      const user = await authAPI.login({ email, password })
      
      // Validate user and role
      if (!user || !user.role) {
        setError("Invalid user data received from server")
        setLoading(false)
        return
      }

      // Store user in localStorage
      setUser(user)

      // Redirect based on user role
      switch (user.role.toUpperCase()) {
        case "ADMIN":
          router.replace("/admin")
          break
        case "DOCTOR":
          router.replace("/doctor")
          break
        case "PATIENT":
          router.replace("/patient")
          break
        default:
          setError(`Unknown user role: ${user.role}. Please contact support.`)
          setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials and try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Stethoscope className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl font-bold">
              Doctor Appointment System
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up as Patient
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

