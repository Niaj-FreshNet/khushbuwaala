// File: components/AdminChartData.tsx
'use client';

import { useGetProductAnalyticsQuery } from "@/redux/store/api/product/productApi";
import AdminRevenueChart from "./AdminRevenueChart";

const AdminChartData = () => {
  const { data: statsData } = useGetProductAnalyticsQuery();
  console.log("statsData: ", statsData);

  const weeklyData = statsData?.data
    ? Object.entries(statsData.data).map(([day, value]) => ({
        day,
        sales: typeof value === "number" ? value : 0,
        orders: 0, // Placeholder for orders (update if API provides)
      }))
    : [];

  return <AdminRevenueChart title="Weekly Sales" weeklyData={weeklyData} />;
};

export default AdminChartData;