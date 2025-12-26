"use client"

import { type User } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, User as UserIcon, Mail, Phone, Calendar, MapPin, Shield } from "lucide-react"

interface AdminProfileClientProps {
  user: User
}

export default function AdminProfileClient({ user }: AdminProfileClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.fullName}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-2">
              <Badge variant="default" className="bg-blue-600">
                {user.role}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <label className="text-xs font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900 mt-1">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <label className="text-xs font-medium text-gray-500">Phone Number</label>
                <p className="text-sm text-gray-900 mt-1">{user.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <label className="text-xs font-medium text-gray-500">Date of Birth</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <label className="text-xs font-medium text-gray-500">Address</label>
                <p className="text-sm text-gray-900 mt-1">{user.address || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

