"use client";

import { useState } from "react";
import Link from "next/link";

interface NewsItem {
  id: number;
  name: string;
  publishTime: string;
  content: string;
  icon?: string;
  isCarousel: boolean;
}

export default function ParkNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([
    {
      id: 1,
      name: "Party Meeting",
      publishTime: "2023-11-01",
      content: "Annual meeting details...",
      isCarousel: true,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<NewsItem>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: NewsItem = {
      id: newsList.length + 1,
      name: formData.name || "",
      content: formData.content || "",
      publishTime: formData.publishTime || new Date().toISOString().split('T')[0],
      icon: formData.icon || "",
      isCarousel: formData.isCarousel || false,
    };
    setNewsList([...newsList, newItem]);
    setIsAdding(false);
    setFormData({});
  };

  const filteredNews = newsList.filter((n) =>
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Party Building News</h1>
        <div className="space-x-4">
             <button
            onClick={() => setIsAdding(!isAdding)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isAdding ? "Cancel" : "Publish News"}
          </button>
          <Link href="/park" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
      </div>

       {isAdding && (
        <div className="mb-8 rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Publish News</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">News Name</label>
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
              <label className="block text-sm font-medium text-gray-700">Publish Time</label>
              <input
                type="date"
                name="publishTime"
                value={formData.publishTime || ""}
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
              <label className="block text-sm font-medium text-gray-700">Icon URL</label>
              <input
                type="text"
                name="icon"
                value={formData.icon || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
              />
            </div>
             <div className="flex items-center">
              <input
                type="checkbox"
                name="isCarousel"
                checked={formData.isCarousel || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-900">Show in Carousel</label>
            </div>
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Publish
            </button>
          </form>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search news..."
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Carousel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredNews.map((news, index) => (
              <tr key={news.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{news.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{news.publishTime}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{news.content}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{news.isCarousel ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
