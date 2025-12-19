"use client";

import { useState } from "react";
import Link from "next/link";

interface Member {
  id: number;
  name: string;
  gender: string;
  ethnicity: string;
  idCard: string;
  phone: string;
  organization: string;
  position: string;
  category: string;
}

export default function ParkMembersPage() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "John Smith",
      gender: "Male",
      ethnicity: "Han",
      idCard: "123456789012345678",
      phone: "13800138000",
      organization: "Tech Branch",
      position: "Developer",
      category: "Full Member",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: Member = {
      id: members.length + 1,
      name: formData.name || "",
      gender: formData.gender || "Male",
      ethnicity: formData.ethnicity || "",
      idCard: formData.idCard || "",
      phone: formData.phone || "",
      organization: formData.organization || "",
      position: formData.position || "",
      category: formData.category || "",
    };
    setMembers([...members, newMember]);
    setIsAdding(false);
    setFormData({});
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Party Member Maintenance</h1>
         <div className="space-x-4">
            <button
            onClick={() => setIsAdding(!isAdding)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isAdding ? "Cancel" : "Add Member"}
          </button>
          <button className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50">Import</button>
          <button className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50">Export</button>
          <Link href="/park" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
      </div>

       {isAdding && (
        <div className="mb-8 rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Add Member</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Ethnicity</label>
              <input type="text" name="ethnicity" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">ID Card</label>
              <input type="text" name="idCard" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" name="phone" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <input type="text" name="organization" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input type="text" name="position" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" name="category" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" />
            </div>
            <div className="md:col-span-2">
                <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search member..."
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID Card</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Organization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredMembers.map((m, index) => (
              <tr key={m.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.idCard}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.organization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
