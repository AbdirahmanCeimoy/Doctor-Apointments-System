"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Calendar, 
  User,
  Clock,
  LogOut,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { clearUser } from "@/lib/auth"

const navigation = [
  { name: "Dashboard", href: "/doctor", icon: LayoutDashboard },
  { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
  { name: "Time Slots", href: "/doctor/time-slots", icon: Clock },
  { name: "Profile", href: "/doctor/profile", icon: User },
]

export function DoctorSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    clearUser()
    router.push("/")
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gray-50">
      <div className="flex h-14 items-center border-b bg-white px-4">
        <h1 className="text-base font-semibold text-gray-900">Doctor Panel</h1>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-[#03045E] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="h-4 w-4" />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5" />}
            </Link>
          )
        })}
      </nav>
      <div className="border-t bg-white p-3">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

