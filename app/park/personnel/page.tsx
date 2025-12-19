"use client";

import { useState } from "react";
import Link from "next/link";

interface Instructor {
  id: number;
  name: string;
  position: string;
  phone: string;
}

interface GridWorker {
  id: number;
  name: string;
  position: string;
  phone: string;
  gridArea: string;
}

interface PersonnelFormData {
  name?: string;
  position?: string;
  phone?: string;
  gridArea?: string;
}

export default function ParkPersonnelPage() {
  const [activeTab, setActiveTab] = useState<"instructors" | "gridWorkers">("instructors");

  const [instructors, setInstructors] = useState<Instructor[]>([
    { id: 1, name: "Alice Brown", position: "Senior Instructor", phone: "555-0101" },
  ]);

  const [gridWorkers, setGridWorkers] = useState<GridWorker[]>([
    { id: 1, name: "Bob Green", position: "Grid Monitor", phone: "555-0202", gridArea: "Block A" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<PersonnelFormData>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "instructors") {
        const newInstructor = {
            id: instructors.length + 1,
            name: formData.name || "",
            position: formData.position || "",
            phone: formData.phone || "",
        };
        setInstructors([...instructors, newInstructor]);
    } else {
        const newWorker = {
            id: gridWorkers.length + 1,
            name: formData.name || "",
            position: formData.position || "",
            phone: formData.phone || "",
            gridArea: formData.gridArea || "",
        };
        setGridWorkers([...gridWorkers, newWorker]);
    }
    setIsAdding(false);
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Personnel Maintenance</h1>
        <Link href="/park" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => { setActiveTab("instructors"); setIsAdding(false); }}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "instructors"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Party Building Instructors
          </button>
          <button
            onClick={() => { setActiveTab("gridWorkers"); setIsAdding(false); }}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "gridWorkers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Grid Workers
          </button>
        </nav>
      </div>

      <div className="mb-4 flex justify-between">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isAdding ? "Cancel" : `Add ${activeTab === "instructors" ? "Instructor" : "Worker"}`}
          </button>
          {activeTab === "instructors" && (
              <div className="space-x-2">
                  <button className="rounded border border-gray-300 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50">Import</button>
                  <button className="rounded border border-gray-300 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50">Export</button>
              </div>
          )}
      </div>

      {isAdding && (
        <div className="mb-8 rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Add New {activeTab === "instructors" ? "Instructor" : "Worker"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input type="text" name="position" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" name="phone" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
            </div>
            {activeTab === "gridWorkers" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grid Area</label>
                  <input type="text" name="gridArea" onChange={handleInputChange} className="mt-1 block w-full rounded border border-gray-300 p-2" required />
                </div>
            )}
            <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">Save</button>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone</th>
              {activeTab === "gridWorkers" && <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Grid Area</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {activeTab === "instructors" ? (
                instructors.map((p, index) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.phone}</td>
                  </tr>
                ))
            ) : (
                gridWorkers.map((p, index) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.gridArea}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
