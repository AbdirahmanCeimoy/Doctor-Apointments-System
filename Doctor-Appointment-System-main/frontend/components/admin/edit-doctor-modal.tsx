"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { doctorProfilesAPI, usersAPI, type DoctorProfile } from "@/lib/api"

interface EditDoctorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  doctor: DoctorProfile | null
}

export function EditDoctorModal({ open, onOpenChange, onSuccess, doctor }: EditDoctorModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    specialization: "",
    qualifications: "",
    experience: "",
    consultationFee: "",
    licenseNumber: "",
    bio: "",
  })

  useEffect(() => {
    if (open && doctor) {
      setFormData({
        specialization: doctor.specialization || "",
        qualifications: doctor.qualifications || "",
        experience: doctor.experience?.toString() || "",
        consultationFee: doctor.consultationFee?.toString() || "",
        licenseNumber: doctor.licenseNumber || "",
        bio: doctor.bio || "",
      })
    }
  }, [open, doctor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctor) return

    setLoading(true)

    try {
      await doctorProfilesAPI.update(doctor.id, {
        specialization: formData.specialization,
        qualifications: formData.qualifications,
        experience: parseInt(formData.experience),
        consultationFee: parseFloat(formData.consultationFee),
        licenseNumber: formData.licenseNumber,
        bio: formData.bio || undefined,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error updating doctor:", error)
      const errorMessage = error?.message || "Failed to update doctor. Please try again."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!doctor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle>Edit Doctor Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 py-2">
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
              <Label htmlFor="experience" className="text-xs">Experience (years) *</Label>
              <Input
                id="experience"
                type="number"
                className="h-9 text-sm"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                required
                min="0"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="consultationFee" className="text-xs">Consultation Fee ($) *</Label>
              <Input
                id="consultationFee"
                type="number"
                step="0.01"
                className="h-9 text-sm"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData({ ...formData, consultationFee: e.target.value })
                }
                required
                min="0"
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
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

