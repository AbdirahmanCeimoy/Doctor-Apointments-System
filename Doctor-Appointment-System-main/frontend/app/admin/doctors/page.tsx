import { doctorProfilesAPI, type DoctorProfile } from "@/lib/api"
import DoctorsTableClient from "./doctors-table-client"

async function getDoctors() {
  try {
    return await doctorProfilesAPI.getAll()
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return []
  }
}

export default async function DoctorsPage() {
  const doctors = await getDoctors()

  return (
    <div className="space-y-8">
      <DoctorsTableClient initialData={doctors} />
    </div>
  )
}
