// File: app/admin/page.tsx
import { Suspense } from "react";
import MetricCard from "./_component/MetricCard";
import AdminChartData from "./_component/AdminChartData";
import BestSelling from "./_component/BestSelling";
import RecentOrderList from "./_component/RecentOrderList";

// Dummy data
const dummyData = {
  todayOrders: 12,
  monthOrders: 320,
  monthSales: 54000,
  totalSales: 125000,
}

export default function AdminDashboard() {
  // Instead of fetching with RTK Query
  const isLoading = false
  const error = null
  const data = { data: dummyData }

  // export default function AdminDashboard() {
  //   const { data, isLoading, error } = useGetMetricStatsQuery({});

  const metrics = data
    ? [
      {
        label: "Today Orders",
        value: data?.data?.todayOrders || "0",
        circleColor: "#FF8C38", // Orange
      },
      {
        label: "This Month Orders",
        value: data?.data?.monthOrders || "0",
        circleColor: "#FFD700", // Yellow
      },
      {
        label: "This Month Sales",
        value: data?.data?.monthSales || "0",
        circleColor: "#000000", // Black
      },
      {
        label: "Total Sales",
        value: data?.data?.totalSales || "0",
        circleColor: "#00C4B4", // Teal
      },
    ]
    : [];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading && <p className="text-gray-500">Loading metrics...</p>}
        {error && <p className="text-red-500">Failed to load statistics.</p>}
        {!isLoading && !error && metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Revenue Chart + Best Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-4 bg-white shadow-md rounded-xl">
          <Suspense fallback={<p>Loading chart...</p>}>
            <AdminChartData />
          </Suspense>
        </div>
        <div className="lg:col-span-2 bg-white shadow-md rounded-xl">
          <Suspense fallback={<p>Loading best selling...</p>}>
            <BestSelling />
          </Suspense>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1">
        <div className="bg-white shadow-md rounded-xl">
          <Suspense fallback={<p>Loading orders...</p>}>
            <RecentOrderList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}