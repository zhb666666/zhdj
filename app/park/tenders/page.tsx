"use client";

import Link from "next/link";

export default function ParkTendersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Public Tender / Park Overview</h1>
        <Link href="/park" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <div className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>
          <p className="text-gray-600">Details about the tender/park...</p>
        </div>

        {/* Opinion Draft */}
        <div className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Opinion Drafts</h2>
          <p className="text-gray-600">Recent opinions...</p>
        </div>

        {/* Party Building News */}
        <div className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Party Building News</h2>
          <p className="text-gray-600">Latest news...</p>
        </div>

        {/* Organization Chart */}
        <div className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Organization Chart</h2>
          <div className="flex h-32 items-center justify-center bg-gray-100 text-gray-400">
            [Chart Placeholder]
          </div>
        </div>

        {/* Data Analysis */}
        <div className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Data Analysis</h2>
          <div className="flex h-32 items-center justify-center bg-gray-100 text-gray-400">
            [Charts/Graphs Placeholder]
          </div>
        </div>

        {/* Instructors & Grid Workers */}
        <div className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Personnel</h2>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Red Machine Party Building Instructor: 5</li>
            <li>Standardized Industrial Community Grid Worker: 12</li>
          </ul>
        </div>
        
         {/* GIS Map */}
        <div className="col-span-1 lg:col-span-2 rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">GIS Map</h2>
          <div className="flex h-64 items-center justify-center bg-blue-50 text-blue-400 border border-blue-100">
            [Interactive GIS Map Placeholder - Click to view Enterprise Info]
          </div>
        </div>
      </div>
    </div>
  );
}
