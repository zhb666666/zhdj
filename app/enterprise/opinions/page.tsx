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
  attachment?: string;
}

export default function EnterpriseOpinionsPage() {
  const [opinions, setOpinions] = useState<Opinion[]>([
    {
      id: 1,
      topic: "Improve canteen food",
      content: "The variety of food needs improvement.",
      organization: "Tech Dept",
      submitter: "John Doe",
      phone: "1234567890",
      submissionTime: "2023-10-27 10:00",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Opinion>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOpinion: Opinion = {
      id: opinions.length + 1,
      topic: formData.topic || "",
      content: formData.content || "",
      organization: formData.organization || "",
      submitter: formData.submitter || "",
      phone: formData.phone || "",
      submissionTime: new Date().toLocaleString(),
      attachment: formData.attachment || "",
    };
    setOpinions([...opinions, newOpinion]);
    setIsAdding(false);
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Opinion Drafts (Enterprise)</h1>
        <div className="space-x-4">
           <button
            onClick={() => setIsAdding(!isAdding)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isAdding ? "Cancel" : "Add New Opinion"}
          </button>
          <Link href="/enterprise" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
      </div>

      {isAdding && (
        <div className="mb-8 rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">New Opinion Draft</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                name="content"
                value={formData.content || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
                rows={3}
                required
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Submitter</label>
              <input
                type="text"
                name="submitter"
                value={formData.submitter || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Attachment (URL or Name)</label>
              <input
                type="text"
                name="attachment"
                value={formData.attachment || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
              />
            </div>
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Submit
            </button>
          </form>
        </div>
      )}

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
