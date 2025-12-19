"use client";

import Link from "next/link";

export default function ParkStatisticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Statistical Analysis</h1>
        <Link href="/park" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Manual Maintenance</h2>
            <p className="mb-4 text-gray-600">Manually update statistical data if automatic collection fails.</p>
            <button className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Open Manual Entry</button>
        </div>

        <div className="rounded bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Data Verification</h2>
            <p className="mb-4 text-gray-600">Run verification checks on the collected data.</p>
            <button className="w-full rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700">Run Verification</button>
        </div>

         <div className="rounded bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Reports</h2>
            <p className="mb-4 text-gray-600">Download monthly analysis reports.</p>
            <button className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">Download PDF</button>
        </div>
      </div>

      <div className="mt-8 rounded bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold">Data Analysis Overview</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="h-64 rounded bg-gray-100 p-4 text-center flex items-center justify-center text-gray-400">
                [Bar Chart Placeholder]
            </div>
             <div className="h-64 rounded bg-gray-100 p-4 text-center flex items-center justify-center text-gray-400">
                [Pie Chart Placeholder]
            </div>
        </div>
      </div>
    </div>
  );
}
