'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/app/components/PageHeader';

export default function BasicInfoPage() {
  const [data, setData] = useState({
    keyEnterprises: 150,
    partyOrganizations: 45,
    partyMembers: 1200,
    communityGrids: 12,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  return (
    <div className="p-8 max-w-2xl">
      <PageHeader title="基本情况维护" />
      <div className="bg-white p-6 rounded-lg shadow dark:bg-zinc-900 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">开发区重点企业数量</label>
          <input
            type="number"
            name="keyEnterprises"
            value={data.keyEnterprises}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-zinc-800 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">管理企业党组织</label>
          <input
            type="number"
            name="partyOrganizations"
            value={data.partyOrganizations}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-zinc-800 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">管理党员</label>
          <input
            type="number"
            name="partyMembers"
            value={data.partyMembers}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-zinc-800 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">高端化工工业社区网格</label>
          <input
            type="number"
            name="communityGrids"
            value={data.communityGrids}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-zinc-800 dark:border-zinc-700"
          />
        </div>
        <div className="flex justify-end pt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">保存修改</button>
        </div>
      </div>
    </div>
  );
}
