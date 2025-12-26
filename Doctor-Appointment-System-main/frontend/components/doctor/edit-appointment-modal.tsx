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
import { appointmentsAPI, type AppointmentStatus, type Appointment } from "@/lib/api"
import { format, parseISO } from "date-fns"

interface EditAppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  appointment: Appointment | null
}

export function EditAppointmentModal({
  open,
  onOpenChange,
  onSuccess,
  appointment,
}: EditAppointmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    appointmentDate: "",
    startTime: "",
    endTime: "",
    status: "PENDING" as AppointmentStatus,
    symptoms: "",
    notes: "",
  })

  useEffect(() => {
    if (open && appointment) {
      // Pre-fill form with existing appointment data
      setFormData({
        appointmentDate: format(parseISO(appointment.appointmentDate), "yyyy-MM-dd"),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        symptoms: appointment.symptoms || "",
        notes: appointment.notes || "",
      })
    }
  }, [open, appointment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appointment) return

    setLoading(true)

    try {
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.startTime}:00`)

      await appointmentsAPI.update(appointment.id, {
        appointmentDate: appointmentDateTime.toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: formData.status,
        symptoms: formData.symptoms || undefined,
        notes: formData.notes || undefined,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error updating appointment:", error)
      const errorMessage = error?.message || "Failed to update appointment. Please try again."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 py-2">
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
              <Label htmlFor="status" className="text-xs">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as AppointmentStatus })
                }
                required
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
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

