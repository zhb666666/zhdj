import React from 'react';
import { Table } from '@/app/components/Table';
import { PageHeader } from '@/app/components/PageHeader';

export default function NoticesPage() {
  const columns = [
    { header: '序号', accessor: 'id' },
    { header: '通知公告名称', accessor: 'title' },
    { header: '发布时间', accessor: 'publishTime' },
    { header: '内容', accessor: 'content' },
    { header: '附件', accessor: 'attachment' },
  ];

  const data = [
    { id: 1, title: '关于放假的通知', publishTime: '2023-09-28', content: '十一放假安排...', attachment: 'document.pdf' },
    { id: 2, title: '安全检查通知', publishTime: '2023-09-15', content: '请各单位做好安全检查...', attachment: 'checklist.docx' },
  ];

  return (
    <div className="p-8">
      <PageHeader title="通知公告" />
      <div className="mb-4 flex gap-4">
        <input 
            type="text" 
            placeholder="资讯名称" 
            className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" 
        />
        <input 
            type="date" 
            className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" 
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">查询</button>
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
}
