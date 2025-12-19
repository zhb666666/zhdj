"use client";

import Link from "next/link";

export default function ParkBasicInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Basic Information Maintenance</h1>
        <Link href="/park" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded bg-white p-6 shadow text-center">
            <h3 className="text-lg font-medium text-gray-500">Key Enterprises</h3>
            <p className="text-3xl font-bold text-gray-900">120</p>
        </div>
        <div className="rounded bg-white p-6 shadow text-center">
            <h3 className="text-lg font-medium text-gray-500">Party Organizations</h3>
            <p className="text-3xl font-bold text-gray-900">45</p>
        </div>
        <div className="rounded bg-white p-6 shadow text-center">
            <h3 className="text-lg font-medium text-gray-500">Party Members</h3>
            <p className="text-3xl font-bold text-gray-900">1,250</p>
        </div>
        <div className="rounded bg-white p-6 shadow text-center">
            <h3 className="text-lg font-medium text-gray-500">Community Grid</h3>
            <p className="text-xl font-bold text-gray-900">High-end Chemical</p>
        </div>
      </div>

      <div className="rounded bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Management Actions</h2>
        <div className="flex gap-4">
             <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Manage Enterprise Party Orgs</button>
             <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Manage Party Members</button>
             <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Manage Grid Info</button>
        </div>
      </div>
    </div>
  );
}
