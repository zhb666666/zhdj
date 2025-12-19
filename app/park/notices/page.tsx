"use client";

import { useState } from "react";
import Link from "next/link";

interface Notice {
  id: number;
  name: string;
  publishTime: string;
  content: string;
  attachment?: string;
}

export default function ParkNoticesPage() {
  const [notices] = useState<Notice[]>([
    {
      id: 1,
      name: "Park Maintenance",
      publishTime: "2023-11-05",
      content: "Scheduled maintenance for the park entrance.",
      attachment: "maintenance_plan.pdf",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotices = notices.filter((n) =>
    n.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notices & Announcements (Park)</h1>
        <Link href="/park" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="rounded border border-gray-300 p-2 w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Publish Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Attachment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredNotices.map((notice, index) => (
              <tr key={notice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{notice.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notice.publishTime}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{notice.content}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{notice.attachment || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
