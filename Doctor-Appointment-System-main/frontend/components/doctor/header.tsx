"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Sun, ChevronDown, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getUser, clearUser } from "@/lib/auth"
import type { User as UserType } from "@/lib/api"

export function DoctorHeader() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  useEffect(() => {
    const user = getUser()
    setCurrentUser(user)
  }, [])

  const handleLogout = () => {
    clearUser()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-900">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Sun className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-auto py-2 px-3 hover:bg-gray-100"
              >
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {currentUser?.fullName || "Doctor"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.fullName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

