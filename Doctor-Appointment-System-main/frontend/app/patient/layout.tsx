import { PatientSidebar } from "@/components/patient/sidebar"
import { PatientHeader } from "@/components/patient/header"
import { RouteGuard } from "@/components/auth/route-guard"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard allowedRoles={["PATIENT"]}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <PatientSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PatientHeader />
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

