"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { doctorProfilesAPI, usersAPI } from "@/lib/api"

interface AddDoctorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddDoctorModal({
  open,
  onOpenChange,
  onSuccess,
}: AddDoctorModalProps) {
  const [loading, setLoading] = useState(false)
  const [doctorUsers, setDoctorUsers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    userId: "",
    specialization: "",
    qualifications: "",
    experience: "",
    consultationFee: "",
    bio: "",
    licenseNumber: "",
  })

  useEffect(() => {
    if (open) {
      // Fetch users with DOCTOR role who don't have a profile yet
      usersAPI
        .getAll()
        .then((users) => {
          const doctors = users.filter((u) => u.role === "DOCTOR")
          setDoctorUsers(doctors)
        })
        .catch(console.error)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.userId) {
        alert("Please select a doctor user")
        setLoading(false)
        return
      }

      const experience = parseInt(formData.experience)
      const consultationFee = parseFloat(formData.consultationFee)

      if (isNaN(experience) || experience < 0) {
        alert("Please enter a valid experience (years)")
        setLoading(false)
        return
      }

      if (isNaN(consultationFee) || consultationFee < 0) {
        alert("Please enter a valid consultation fee")
        setLoading(false)
        return
      }

      await doctorProfilesAPI.create({
        userId: formData.userId,
        specialization: formData.specialization,
        qualifications: formData.qualifications,
        experience: experience,
        consultationFee: consultationFee,
        bio: formData.bio || undefined,
        licenseNumber: formData.licenseNumber,
      })
      onSuccess()
      onOpenChange(false)
      // Reset form
      setFormData({
        userId: "",
        specialization: "",
        qualifications: "",
        experience: "",
        consultationFee: "",
        bio: "",
        licenseNumber: "",
      })
    } catch (error: any) {
      console.error("Error creating doctor profile:", error)
      const errorMessage = error?.message || "Failed to create doctor profile. Please try again."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle>Add New Doctor Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="grid gap-1.5 col-span-2">
              <Label htmlFor="userId" className="text-xs">Doctor User *</Label>
              <Select
                value={formData.userId}
                onValueChange={(value) =>
                  setFormData({ ...formData, userId: value })
                }
                required
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select a doctor user" />
                </SelectTrigger>
                <SelectContent>
                  {doctorUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="specialization" className="text-xs">Specialization *</Label>
              <Input
                id="specialization"
                className="h-9 text-sm"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="qualifications" className="text-xs">Qualifications *</Label>
              <Input
                id="qualifications"
                className="h-9 text-sm"
                value={formData.qualifications}
                onChange={(e) =>
                  setFormData({ ...formData, qualifications: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="licenseNumber" className="text-xs">License Number *</Label>
              <Input
                id="licenseNumber"
                className="h-9 text-sm"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="experience" className="text-xs">Experience (years) *</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                className="h-9 text-sm"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="consultationFee" className="text-xs">Consultation Fee ($) *</Label>
              <Input
                id="consultationFee"
                type="number"
                step="0.01"
                min="0"
                className="h-9 text-sm"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData({ ...formData, consultationFee: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-1.5 col-span-2">
              <Label htmlFor="bio" className="text-xs">Bio</Label>
              <Textarea
                id="bio"
                className="text-sm min-h-[60px]"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

