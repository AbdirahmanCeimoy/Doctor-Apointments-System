"use client"

import { type DoctorProfile, type User } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Stethoscope, GraduationCap, DollarSign, FileText, User as UserIcon } from "lucide-react"

interface DoctorProfileClientProps {
  profile: DoctorProfile | null
  user: User | null
}

export default function DoctorProfileClient({ profile, user }: DoctorProfileClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.fullName || "N/A"}
              </h2>
              <p className="text-sm text-gray-500">{user?.email || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500">Role</label>
              <div className="mt-1">
                <Badge variant="default" className="bg-blue-600">
                  {user?.role || "N/A"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Phone Number</label>
              <p className="text-sm text-gray-900 mt-1">{user?.phoneNumber || "N/A"}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Date of Birth</label>
              <p className="text-sm text-gray-900 mt-1">
                {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Address</label>
              <p className="text-sm text-gray-900 mt-1">{user?.address || "N/A"}</p>
            </div>
          </div>
        </Card>

        {/* Professional Information */}
        {profile && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Stethoscope className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <label className="text-xs font-medium text-gray-500">Specialization</label>
                  <p className="text-sm text-gray-900 mt-1">{profile.specialization}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <label className="text-xs font-medium text-gray-500">Qualifications</label>
                  <p className="text-sm text-gray-900 mt-1">{profile.qualifications}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <label className="text-xs font-medium text-gray-500">License Number</label>
                  <p className="text-sm text-gray-900 mt-1">{profile.licenseNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <label className="text-xs font-medium text-gray-500">Consultation Fee</label>
                  <p className="text-sm text-gray-900 mt-1">${profile.consultationFee}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Experience</label>
                <div className="mt-1">
                  <Badge variant="outline">{profile.experience} years</Badge>
                </div>
              </div>

              {profile.bio && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Bio</label>
                  <p className="text-sm text-gray-900 mt-1">{profile.bio}</p>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {!profile && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Details</h3>
            <p className="text-sm text-gray-600">No professional profile found. Please create a doctor profile.</p>
          </Card>
        )}
      </div>
    </div>
  )
}

