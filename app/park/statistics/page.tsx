'use client';

import React from 'react';
import { PageHeader } from '@/app/components/PageHeader';

export default function StatisticsPage() {
  return (
    <div className="p-8">
      <PageHeader title="统计分析" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow dark:bg-zinc-900 border dark:border-zinc-800">
            <h3 className="text-xl font-bold mb-4">手动维护</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">手动录入或调整统计数据。</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">进入维护</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow dark:bg-zinc-900 border dark:border-zinc-800">
            <h3 className="text-xl font-bold mb-4">数据统计分析</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">查看各类报表和分析图表。</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">查看分析</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow dark:bg-zinc-900 border dark:border-zinc-800">
            <h3 className="text-xl font-bold mb-4">数据核对</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">核对系统数据与实际情况。</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">开始核对</button>
        </div>
      </div>
    </div>
  );
}
