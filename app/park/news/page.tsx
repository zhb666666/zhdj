import React from 'react';
import { Table } from '@/app/components/Table';
import { PageHeader } from '@/app/components/PageHeader';

export default function PartyNewsPage() {
  const columns = [
    { header: '序号', accessor: 'id' },
    { header: '资讯名称', accessor: 'title' },
    { header: '发布时间', accessor: 'publishTime' },
    { header: '内容', accessor: 'content' },
    { header: '是否轮播展示', accessor: 'isCarousel' },
  ];

  const data = [
    { id: 1, title: '学习二十大精神', publishTime: '2023-10-01', content: '深入学习...', isCarousel: '是' },
    { id: 2, title: '党日活动回顾', publishTime: '2023-09-28', content: '上周举办了...', isCarousel: '否' },
  ];

  return (
    <div className="p-8">
      <PageHeader title="党建资讯管理" />
      <div className="bg-white p-4 rounded shadow mb-6 dark:bg-zinc-900">
        <h3 className="font-medium mb-4">资讯发布</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="资讯名称" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
            <input type="date" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
            <textarea placeholder="内容" className="border p-2 rounded col-span-2 dark:bg-zinc-800 dark:border-zinc-700" rows={2} />
            <div className="flex items-center gap-2">
                <input type="checkbox" id="carousel" />
                <label htmlFor="carousel">是否轮播</label>
            </div>
            <div className="col-span-2 text-right">
                <button className="bg-green-600 text-white px-4 py-2 rounded">发布</button>
            </div>
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <input type="text" placeholder="查询: 资讯名称" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">查询</button>
      </div>

      <Table columns={columns} data={data} />
    </div>
  );
}
