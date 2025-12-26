import { timeSlotsAPI, type TimeSlot } from "@/lib/api"
import TimeSlotsTableClient from "./time-slots-table-client"

async function getTimeSlots() {
  try {
    return await timeSlotsAPI.getAll()
  } catch (error) {
    console.error("Error fetching time slots:", error)
    return []
  }
}

export default async function TimeSlotsPage() {
  const timeSlots = await getTimeSlots()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Time Slots</h1>
        <p className="text-muted-foreground">
          Manage doctor availability time slots
        </p>
      </div>

      <TimeSlotsTableClient initialData={timeSlots} />
    </div>
  )
}
