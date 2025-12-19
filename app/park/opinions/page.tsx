"use client";

import { useState } from "react";
import Link from "next/link";

interface Opinion {
  id: number;
  topic: string;
  content: string;
  organization: string;
  submitter: string;
  phone: string;
  submissionTime: string;
}

export default function ParkOpinionsPage() {
  const [opinions] = useState<Opinion[]>([
    {
      id: 1,
      topic: "Park Lighting",
      content: "More lights needed in sector B.",
      organization: "Logistics",
      submitter: "Jane Smith",
      phone: "9876543210",
      submissionTime: "2023-10-28 14:30",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Opinion Drafts (Park)</h1>
        <Link href="/park" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <div className="overflow-hidden rounded bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Topic</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Organization</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {opinions.map((op, index) => (
              <tr key={op.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{op.topic}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{op.content}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{op.organization}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{op.submissionTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
