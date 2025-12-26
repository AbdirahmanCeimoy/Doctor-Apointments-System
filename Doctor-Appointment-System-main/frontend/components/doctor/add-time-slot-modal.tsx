"use client"

import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { timeSlotsAPI } from "@/lib/api"

interface AddTimeSlotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  doctorId: string
}

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const

export function AddTimeSlotModal({
  open,
  onOpenChange,
  onSuccess,
  doctorId,
}: AddTimeSlotModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    isAvailable: true,
  })

  // Reset form when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedDays([])
      setFormData({
        startTime: "",
        endTime: "",
        isAvailable: true,
      })
    }
    onOpenChange(newOpen)
  }

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    )
  }

  const handleSelectAll = () => {
    if (selectedDays.length === DAYS_OF_WEEK.length) {
      setSelectedDays([])
    } else {
      setSelectedDays([...DAYS_OF_WEEK])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (selectedDays.length === 0) {
        alert("Please select at least one day")
        setLoading(false)
        return
      }

      if (!formData.startTime || !formData.endTime) {
        alert("Please fill in start time and end time")
        setLoading(false)
        return
      }

      // Create a time slot for each selected day
      const promises = selectedDays.map((day) =>
        timeSlotsAPI.create({
          dayOfWeek: day,
          startTime: formData.startTime,
          endTime: formData.endTime,
          isAvailable: formData.isAvailable,
          doctorId: doctorId,
        })
      )

      await Promise.all(promises)
      onSuccess()
      handleOpenChange(false)
    } catch (error: any) {
      console.error("Error creating time slots:", error)
      const errorMessage = error?.message || "Failed to create time slots. Please try again."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-3">
          <DialogTitle>Add Time Slot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Days of Week *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={handleSelectAll}
                >
                  {selectedDays.length === DAYS_OF_WEEK.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg bg-gray-50">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day}`}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Label
                      htmlFor={`day-${day}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedDays.length === 0 && (
                <p className="text-xs text-red-500">Please select at least one day</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
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
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="isAvailable" className="text-xs">Status</Label>
              <Select
                value={formData.isAvailable ? "true" : "false"}
                onValueChange={(value) =>
                  setFormData({ ...formData, isAvailable: value === "true" })
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
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

