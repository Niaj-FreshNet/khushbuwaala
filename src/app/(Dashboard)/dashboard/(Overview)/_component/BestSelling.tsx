// File: components/BestSelling.tsx
'use client';

import { useGetBestsellersQuery } from "@/redux/store/api/product/productApi";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#f59e0b", "#10b981", "#000000", "#22c55e", "#6366f1", "#f43f5e"];

interface PieData {
  label: string;
  value: number;
  color: string;
}

const BestSelling: React.FC = () => {
  const { data, isLoading, isError } = useGetBestsellersQuery();
  console.log('best seller: ', data)

  const pieData: PieData[] =
    data?.data?.map((item: any, index: number) => ({
      label: item.category,
      value: item.percentage,
      color: COLORS[index % COLORS.length],
    })) || [];

  const renderLabel = () => (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan x="50%" dy="-0.5em" fontSize={12}>
        This Week
      </tspan>
    </text>
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">This Week</h2>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load data</p>
      ) : (
        <div className="flex flex-col">
          {/* Pie Chart */}
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-0.5em" fontSize={12}>
                      This Week
                    </tspan>
                  </text>
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                {/* <span className="text-gray-700">{item.label}</span> */}
                <span className="font-semibold" style={{ color: item.color }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BestSelling;