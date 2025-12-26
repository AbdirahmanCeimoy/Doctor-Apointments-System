"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getUser, getUserRole } from "@/lib/auth"
import type { UserRole } from "@/lib/api"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const user = getUser()
      const userRole = getUserRole()

      // If no user, redirect to login immediately
      if (!user || !userRole) {
        setShouldRedirect(true)
        router.replace("/login")
        return
      }

      // Validate role is a valid UserRole
      const validRoles: UserRole[] = ["ADMIN", "DOCTOR", "PATIENT"]
      if (!validRoles.includes(userRole as UserRole)) {
        setShouldRedirect(true)
        router.replace("/login")
        return
      }

      // Check if user's role is allowed
      if (!allowedRoles.includes(userRole as UserRole)) {
        // Redirect to appropriate dashboard based on role
        setShouldRedirect(true)
        switch (userRole) {
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
            router.replace("/login")
        }
        return
      }

      // User is authorized
      setIsAuthorized(true)
      setIsLoading(false)
    }

    // Check immediately on mount
    checkAuth()
  }, [router, pathname, allowedRoles])

  // Show loading or nothing while redirecting
  if (shouldRedirect || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

