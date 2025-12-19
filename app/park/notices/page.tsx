import React from 'react';
import { Table } from '@/app/components/Table';
import { PageHeader } from '@/app/components/PageHeader';

export default function ParkNoticesPage() {
  const columns = [
    { header: '序号', accessor: 'id' },
    { header: '通知公告名称', accessor: 'title' },
    { header: '发布时间', accessor: 'publishTime' },
    { header: '内容', accessor: 'content' },
    { header: '附件', accessor: 'attachment' },
  ];

  const data = [
    { id: 1, title: '关于放假的通知', publishTime: '2023-09-28', content: '十一放假安排...', attachment: 'document.pdf' },
  ];

  return (
    <div className="p-8">
      <PageHeader title="通知公告管理 (园区端)" />
      
      <div className="bg-white p-4 rounded shadow mb-6 dark:bg-zinc-900">
        <h3 className="font-medium mb-4">发布通知</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="通知名称" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <input type="date" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <textarea placeholder="内容" className="border p-2 rounded col-span-2 dark:bg-zinc-800 dark:border-zinc-700" rows={2} />
             <input type="file" className="col-span-2" />
             <div className="col-span-2 text-right">
                <button className="bg-green-600 text-white px-4 py-2 rounded">发布</button>
            </div>
        </div>
      </div>

      <Table columns={columns} data={data} />
    </div>
  );
}
