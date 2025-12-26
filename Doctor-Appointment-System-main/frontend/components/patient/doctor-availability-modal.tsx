"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type TimeSlot, type DoctorProfile } from "@/lib/api"
import { Calendar, Clock } from "lucide-react"

interface DoctorAvailabilityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: DoctorProfile | null
  timeSlots: TimeSlot[]
}

export function DoctorAvailabilityModal({
  open,
  onOpenChange,
  doctor,
  timeSlots,
}: DoctorAvailabilityModalProps) {
  if (!doctor) return null

  // Group by day (show all slots, but highlight available ones)
  const byDay: Record<string, TimeSlot[]> = {}
  timeSlots.forEach(slot => {
    const day = slot.dayOfWeek
    if (!byDay[day]) {
      byDay[day] = []
    }
    byDay[day].push(slot)
  })

  // Sort days
  const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
  const sortedDays = Object.keys(byDay).sort((a, b) => {
    return dayOrder.indexOf(a) - dayOrder.indexOf(b)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Availability - {doctor.user?.fullName || "Doctor"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {sortedDays.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No availability set for this doctor.</p>
            </div>
          ) : (
            sortedDays.map((day) => (
              <div key={day} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-sm font-semibold">
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {byDay[day]
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((slot, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm p-2 rounded ${
                        slot.isAvailable 
                          ? "bg-green-50 text-gray-700 border border-green-200" 
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      <Clock className={`h-4 w-4 ${slot.isAvailable ? "text-green-600" : "text-gray-400"}`} />
                      <span className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <Badge 
                        variant={slot.isAvailable ? "success" : "destructive"} 
                        className="ml-auto text-xs"
                      >
                        {slot.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

