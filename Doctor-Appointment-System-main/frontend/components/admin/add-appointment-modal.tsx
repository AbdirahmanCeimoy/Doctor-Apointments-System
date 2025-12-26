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
import { appointmentsAPI, usersAPI, doctorProfilesAPI, type AppointmentStatus } from "@/lib/api"

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
  const [patients, setPatients] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [formData, setFormData] = useState({
    appointmentDate: "",
    startTime: "",
    endTime: "",
    status: "PENDING" as AppointmentStatus,
    symptoms: "",
    notes: "",
    patientId: "",
    doctorId: "",
  })

  useEffect(() => {
    if (open) {
      // Fetch patients and doctors
      Promise.all([
        usersAPI.getAll().then((users) =>
          users.filter((u) => u.role === "PATIENT")
        ),
        doctorProfilesAPI.getAll(),
      ])
        .then(([patientsData, doctorsData]) => {
          setPatients(patientsData)
          setDoctors(doctorsData)
        })
        .catch(console.error)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.patientId || !formData.doctorId) {
        alert("Please select both a patient and a doctor")
        setLoading(false)
        return
      }

      // Combine date and time into ISO string
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.startTime}:00`)
      
      await appointmentsAPI.create({
        appointmentDate: appointmentDateTime.toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: formData.status,
        symptoms: formData.symptoms || undefined,
        notes: formData.notes || undefined,
        patientId: formData.patientId,
        doctorId: formData.doctorId,
      })
      onSuccess()
      onOpenChange(false)
      // Reset form
      setFormData({
        appointmentDate: "",
        startTime: "",
        endTime: "",
        status: "PENDING",
        symptoms: "",
        notes: "",
        patientId: "",
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
          <DialogTitle>Add New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="patientId" className="text-xs">Patient *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) =>
                  setFormData({ ...formData, patientId: value })
                }
                required
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
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
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.user?.fullName || "N/A"}
                    </SelectItem>
                  ))}
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
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="status" className="text-xs">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as AppointmentStatus })
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
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
              />
            </div>
            <div className="grid gap-1.5 col-span-2">
              <Label htmlFor="notes" className="text-xs">Notes</Label>
              <Textarea
                id="notes"
                className="text-sm min-h-[60px]"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
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

