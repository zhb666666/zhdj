import React from 'react';
import { Table } from '@/app/components/Table';
import { PageHeader } from '@/app/components/PageHeader';

export default function OrganizationPage() {
  const columns = [
    { header: '序号', accessor: 'id' },
    { header: '组织机构名称', accessor: 'name' },
    { header: '组织机构代码', accessor: 'code' },
    { header: '组织机构类别', accessor: 'category' },
  ];

  const data = [
    { id: 1, name: '党支部A', code: 'ORG001', category: '党支部' },
    { id: 2, name: '党总支B', code: 'ORG002', category: '党总支' },
  ];

  return (
    <div className="p-8">
      <PageHeader title="组织机构维护" />
      <div className="bg-white p-4 rounded shadow mb-6 dark:bg-zinc-900">
        <h3 className="font-medium mb-4">新增/编辑机构</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input type="text" placeholder="机构名称" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <input type="text" placeholder="机构代码" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <select className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700">
                 <option>请选择类别</option>
                 <option>党支部</option>
                 <option>党总支</option>
                 <option>党委</option>
             </select>
             <div className="col-span-3 text-right">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">保存</button>
            </div>
        </div>
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
}
