"use client";

import { useState } from "react";
import Link from "next/link";

interface Organization {
  id: number;
  name: string;
  code: string;
  category: string;
}

export default function ParkOrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([
    {
      id: 1,
      name: "Finance Department",
      code: "FIN001",
      category: "Administrative",
    },
    {
      id: 2,
      name: "Engineering Department",
      code: "ENG002",
      category: "Technical",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Organization>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrg: Organization = {
      id: orgs.length + 1,
      name: formData.name || "",
      code: formData.code || "",
      category: formData.category || "",
    };
    setOrgs([...orgs, newOrg]);
    setIsAdding(false);
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Organization Maintenance</h1>
        <div className="space-x-4">
             <button
            onClick={() => setIsAdding(!isAdding)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isAdding ? "Cancel" : "Add Organization"}
          </button>
          <Link href="/park" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
      </div>

       {isAdding && (
        <div className="mb-8 rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Add Organization</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Code</label>
              <input
                type="text"
                name="code"
                value={formData.code || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                 name="category"
                 value={formData.category || ""}
                 onChange={handleInputChange}
                 className="mt-1 block w-full rounded border border-gray-300 p-2"
                 required
              >
                  <option value="">Select Category</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Technical">Technical</option>
                  <option value="Service">Service</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Save
            </button>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orgs.map((org, index) => (
              <tr key={org.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
