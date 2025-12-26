"use client"

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface DashboardChartsProps {
  stats: {
    totalAppointments: number
    pendingAppointments: number
    confirmedAppointments: number
    completedAppointments: number
    activeAppointments: number
  }
}

const COLORS = {
  pending: "#3b82f6",
  active: "#60a5fa",
  completed: "#a855f7",
}

export default function DashboardCharts({ stats }: DashboardChartsProps) {
  const appointmentStatusData = [
    { name: "Active", value: stats.activeAppointments, color: COLORS.active },
    { name: "Pending", value: stats.pendingAppointments, color: COLORS.pending },
    { name: "Completed", value: stats.completedAppointments, color: COLORS.completed },
  ]

  // Generate sample monthly data (you can replace this with real data from API)
  const monthlyData = [
    { month: "Jan", Appointments: 0 },
    { month: "Feb", Appointments: 0 },
    { month: "Mar", Appointments: 0 },
    { month: "Apr", Appointments: 0 },
    { month: "May", Appointments: 0 },
    { month: "Jun", Appointments: 0 },
    { month: "Jul", Appointments: 15 },
    { month: "Aug", Appointments: stats.totalAppointments },
    { month: "Sep", Appointments: 0 },
    { month: "Oct", Appointments: 0 },
    { month: "Nov", Appointments: 0 },
    { month: "Dec", Appointments: 0 },
  ]

  const totalCases = stats.totalAppointments || 0

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Appointment Status Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Appointment Status Distribution
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Current period overview
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={appointmentStatusData.filter((d) => d.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={false}
              >
                {appointmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">
            {totalCases} Total Appointments
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {appointmentStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">
                  {item.name} {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Appointment Timeline
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Monthly progression
            </p>
          </div>
          <select className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>2025</option>
            <option>2024</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              stroke="#e5e7eb"
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              stroke="#e5e7eb"
              domain={[0, "dataMax + 5"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="Appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
