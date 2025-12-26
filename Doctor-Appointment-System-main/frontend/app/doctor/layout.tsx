import { DoctorSidebar } from "@/components/doctor/sidebar"
import { DoctorHeader } from "@/components/doctor/header"
import { RouteGuard } from "@/components/auth/route-guard"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard allowedRoles={["DOCTOR"]}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <DoctorSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DoctorHeader />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  )
}

