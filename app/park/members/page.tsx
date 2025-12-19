'use client';

import React from 'react';
import { Table } from '@/app/components/Table';
import { PageHeader } from '@/app/components/PageHeader';

export default function MembersPage() {
  const columns = [
    { header: '序号', accessor: 'id' },
    { header: '姓名', accessor: 'name' },
    { header: '身份证号', accessor: 'idCard' },
    { header: '联系电话', accessor: 'phone' },
    { header: '所属组织', accessor: 'organization' },
  ];

  const data = [
    { id: 1, name: '王五', idCard: '110101199001011234', phone: '13700000003', organization: '党支部A' },
  ];

  return (
    <div className="p-8">
      <PageHeader title="党员维护" />
      
      <div className="bg-white p-4 rounded shadow mb-6 dark:bg-zinc-900">
        <h3 className="font-medium mb-4">党员查询</h3>
        <div className="flex flex-wrap gap-4 mb-4">
             <input type="text" placeholder="姓名" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <input type="text" placeholder="职务" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <input type="text" placeholder="指导企业" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <select className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700">
                 <option>人员类别</option>
                 <option>正式党员</option>
                 <option>预备党员</option>
             </select>
             <button className="bg-blue-600 text-white px-4 py-2 rounded">查询</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6 dark:bg-zinc-900">
        <h3 className="font-medium mb-4">新增党员</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
             <input type="text" placeholder="姓名" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <select className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700">
                <option>性别</option>
                <option>男</option>
                <option>女</option>
             </select>
             <input type="text" placeholder="民族" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <input type="text" placeholder="身份证号" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <input type="text" placeholder="联系电话" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <input type="text" placeholder="所属组织" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <input type="text" placeholder="管理党员(关联)" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
             <div className="flex gap-2 items-end">
                <button className="bg-green-600 text-white px-4 py-2 rounded">保存</button>
             </div>
        </div>
         <div className="flex gap-2 border-t pt-4 dark:border-zinc-700">
            <button className="bg-gray-600 text-white px-4 py-2 rounded">导入</button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded">导出</button>
        </div>
      </div>

      <Table columns={columns} data={data} />
    </div>
  );
}
