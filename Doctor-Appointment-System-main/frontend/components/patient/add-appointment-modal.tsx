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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { appointmentsAPI, usersAPI, doctorProfilesAPI, type AppointmentStatus } from "@/lib/api"
import { getUser } from "@/lib/auth"

interface AddAppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddAppointmentModal({
  open,
  onOpenChange,
  onSuccess,
}: AddAppointmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const [currentPatientId, setCurrentPatientId] = useState<string>("")
  const [formData, setFormData] = useState({
    appointmentDate: "",
    startTime: "",
    endTime: "",
    symptoms: "",
    notes: "",
    doctorId: "",
  })

  useEffect(() => {
    if (open) {
      // Get current patient from localStorage
      const user = getUser()
      if (user) {
        setCurrentPatientId(user.id)
      }

      // Fetch all users with DOCTOR role, then get their profiles
      Promise.all([
        usersAPI.getAll().then((users) => {
          const doctorUsers = users.filter((u) => u.role === "DOCTOR")
          console.log("All users:", users)
          console.log("Filtered Doctor Users:", doctorUsers)
          return doctorUsers
        }),
        doctorProfilesAPI.getAll(),
      ])
        .then(([doctorUsers, doctorProfiles]) => {
          console.log("Doctor Users count:", doctorUsers.length)
          console.log("Doctor Users:", doctorUsers.map(u => ({ id: u.id, name: u.fullName })))
          console.log("Doctor Profiles count:", doctorProfiles.length)
          console.log("Doctor Profiles:", doctorProfiles.map(p => ({ id: p.id, userId: p.userId })))
          
          // Map doctor users with their profiles - ensure ALL doctors are included
          const doctorsWithProfiles = doctorUsers.map((user) => {
            const profile = doctorProfiles.find((p) => p.userId === user.id)
            const doctorData = {
              id: profile?.id || null, // Profile ID if exists, null otherwise
              userId: user.id,
              user: user,
              hasProfile: !!profile, // Flag to indicate if profile exists
              profile: profile || null, // Store profile separately
            }
            console.log(`Mapped doctor: ${user.fullName} (${user.id}), hasProfile: ${doctorData.hasProfile}, profileId: ${doctorData.id}`)
            return doctorData
          })
          
          console.log("Total doctors to display:", doctorsWithProfiles.length)
          console.log("Final doctors array:", doctorsWithProfiles.map(d => ({ name: d.user?.fullName, hasProfile: d.hasProfile })))
          setDoctors(doctorsWithProfiles)
        })
        .catch((error) => {
          console.error("Error fetching doctors:", error)
        })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!currentPatientId) {
        alert("Please login to create an appointment")
        setLoading(false)
        return
      }

      if (!formData.doctorId) {
        alert("Please select a doctor")
        setLoading(false)
        return
      }

      // Find the selected doctor
      // Handle both profile ID and user-{userId} format
      let selectedDoctor
      if (formData.doctorId.startsWith('user-')) {
        const userId = formData.doctorId.replace('user-', '')
        selectedDoctor = doctors.find((d) => d.userId === userId)
      } else {
        selectedDoctor = doctors.find((d) => d.id === formData.doctorId || d.userId === formData.doctorId)
      }
      
      if (!selectedDoctor) {
        alert("Selected doctor not found")
        setLoading(false)
        return
      }

      // Check if doctor has a profile (required for appointments)
      const hasProfile = selectedDoctor.hasProfile || !!selectedDoctor.id
      if (!hasProfile) {
        alert("This doctor doesn't have a profile yet. Please ask the admin to create a doctor profile first.")
        setLoading(false)
        return
      }

      // Use profile ID for appointment
      const doctorIdToUse = selectedDoctor.id
      
      if (!doctorIdToUse) {
        alert("This doctor doesn't have a profile yet. Please ask the admin to create a doctor profile first.")
        setLoading(false)
        return
      }

      // Combine date and time into ISO string
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.startTime}:00`)
      
      await appointmentsAPI.create({
        appointmentDate: appointmentDateTime.toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: "PENDING", // Default status for patient-created appointments
        symptoms: formData.symptoms || undefined,
        notes: formData.notes || undefined,
        patientId: currentPatientId,
        doctorId: doctorIdToUse,
      })
      onSuccess()
      onOpenChange(false)
      // Reset form
      setFormData({
        appointmentDate: "",
        startTime: "",
        endTime: "",
        symptoms: "",
        notes: "",
        doctorId: "",
      })
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      const errorMessage = error?.message || "Failed to create appointment. Please try again."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle>Book New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="grid gap-1.5 col-span-2">
              <Label htmlFor="doctorId" className="text-xs">Doctor *</Label>
              <Select
                value={formData.doctorId}
                onValueChange={(value) =>
                  setFormData({ ...formData, doctorId: value })
                }
                required
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.length === 0 ? (
                    <SelectItem value="no-doctors" disabled>
                      No doctors available
                    </SelectItem>
                  ) : (
                    <>
                      {console.log("Rendering doctors in SelectContent, count:", doctors.length)}
                      {doctors.map((doctor, index) => {
                        const hasProfile = doctor.hasProfile || !!doctor.id
                        const displayName = doctor.user?.fullName || "N/A"
                        const value = hasProfile ? doctor.id : `user-${doctor.userId}`
                        
                        console.log(`Rendering doctor ${index}: ${displayName}, hasProfile: ${hasProfile}, value: ${value}, userId: ${doctor.userId}`)
                        
                        return (
                          <SelectItem 
                            key={`doctor-${doctor.userId}-${index}`} 
                            value={value}
                            disabled={!hasProfile}
                          >
                            {displayName}
                            {!hasProfile && " (No profile)"}
                          </SelectItem>
                        )
                      })}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="appointmentDate" className="text-xs">Date *</Label>
              <Input
                id="appointmentDate"
                type="date"
                className="h-9 text-sm"
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentDate: e.target.value })
                }
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="startTime" className="text-xs">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                className="h-9 text-sm"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="endTime" className="text-xs">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                className="h-9 text-sm"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-1.5 col-span-2">
              <Label htmlFor="symptoms" className="text-xs">Symptoms</Label>
              <Textarea
                id="symptoms"
                className="text-sm min-h-[60px]"
                value={formData.symptoms}
                onChange={(e) =>
                  setFormData({ ...formData, symptoms: e.target.value })
                }
                placeholder="Describe your symptoms..."
              />
            </div>
            <div className="grid gap-1.5 col-span-2">
              <Label htmlFor="notes" className="text-xs">Additional Notes</Label>
              <Textarea
                id="notes"
                className="text-sm min-h-[60px]"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional information..."
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
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

