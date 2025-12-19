'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/app/components/PageHeader';
import { useRouter } from 'next/navigation';

export default function NewOpinionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    organization: '',
    submitTime: new Date().toISOString().split('T')[0],
    submitter: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    // In a real app, send data to API
    router.push('/enterprise/opinions');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <PageHeader title="新增意见稿" />
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow dark:bg-zinc-900">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">意见主题</label>
          <input
            type="text"
            name="subject"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-zinc-800 dark:border-zinc-700"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">意见内容</label>
          <textarea
            name="content"
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-zinc-800 dark:border-zinc-700"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">所属机构</label>
          <input
            type="text"
            name="organization"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-zinc-800 dark:border-zinc-700"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">提交人员</label>
          <input
            type="text"
            name="submitter"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-zinc-800 dark:border-zinc-700"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">联系电话</label>
          <input
            type="text"
            name="phone"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-zinc-800 dark:border-zinc-700"
            onChange={handleChange}
          />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">提交时间</label>
          <input
            type="date"
            name="submitTime"
            value={formData.submitTime}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-zinc-800 dark:border-zinc-700"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">附件</label>
          <input
            type="file"
            name="attachment"
            className="mt-1 block w-full text-sm text-gray-500"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
            <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
            >
                取消
            </button>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                提交
            </button>
        </div>
      </form>
    </div>
  );
}
