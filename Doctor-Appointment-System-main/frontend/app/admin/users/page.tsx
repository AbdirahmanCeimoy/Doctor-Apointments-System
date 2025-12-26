import { usersAPI, type User } from "@/lib/api"
import UsersTableClient from "./users-table-client"

async function getUsers() {
  try {
    return await usersAPI.getAll()
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-8">
      <UsersTableClient initialData={users} />
    </div>
  )
}
