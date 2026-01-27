// File: components/RecentOrderList.tsx
'use client';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/redux/store/api/order/ordersApi";
import { debounce } from "lodash";
import { toast } from "sonner";
import { LuSearch, LuChevronDown, LuFileText } from "react-icons/lu";

interface Order {
  key: string;
  id: string;
  orderTime: string;
  email: string;
  method: string;
  amount: string;
  status: string;
}

const statusColors: { [key: string]: string } = {
  Processing: "#ADD8E6",
  Delivered: "#90EE90",
  Cancel: "#FFDAB9",
};

const RecentOrderList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const sortField = "createdAt";

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setDebouncedSearch(val), 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchText);
  }, [searchText, debouncedSetSearch]);

  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    searchTerm: debouncedSearch,
    page: currentPage,
    limit: pageSize,
    sort: sortField,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const orders = data?.data?.data || [];
  const total = data?.data?.meta?.total || 0;

  console.log('orders: ', orders)

  const transformedOrders: Order[] = orders.map((order: any, index: number) => ({
    key: order.id || index.toString(),
    id: order.id,
    orderTime: order.orderTime?.split("T")[0] || "N/A",
    email: order?.customer?.name || "No Email",
    method: order.method || "Unknown",
    amount: `$${(order.amount || 0).toLocaleString()}`,
    status: order.status || "Processing",
  }));

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus({ id: orderId, status }).unwrap();
      toast.success(`Order ${orderId} marked as ${status}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        <div className="relative w-full sm:w-64">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-amber-100">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Order Time</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Method</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
              <th className="p-3">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="p-4 text-center">Loading...</td>
              </tr>
            ) : transformedOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center">No orders found</td>
              </tr>
            ) : (
              transformedOrders.map((order) => (
                <tr key={order.key} className="border-b">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.orderTime}</td>
                  <td className="p-3">{order.email}</td>
                  <td className="p-3">{order.method}</td>
                  <td className="p-3">{order.amount}</td>
                  <td className="p-3">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs"
                      style={{ backgroundColor: statusColors[order.status] || "#ADD8E6" }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {order.status === "Processing" && (
                      <div className="relative group">
                        <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                          Action <LuChevronDown />
                        </button>
                        <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-1 z-10">
                          <button
                            onClick={() => handleStatusChange(order.id, "DELIVERED")}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            DELIVERED
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/invoice/${order.id}`} className="text-indigo-600 hover:text-indigo-800">
                      <LuFileText className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <p>
          Showing {(currentPage - 1) * pageSize + 1} -{" "}
          {(currentPage - 1) * pageSize + transformedOrders.length} of {total}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * pageSize >= total}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentOrderList;