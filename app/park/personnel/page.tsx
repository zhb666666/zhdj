'use client';

import React, { useState } from 'react';
import { Table } from '@/app/components/Table';
import { PageHeader } from '@/app/components/PageHeader';

export default function PersonnelPage() {
  const [activeTab, setActiveTab] = useState('guide');

  const guideColumns = [
    { header: '序号', accessor: 'id' },
    { header: '姓名', accessor: 'name' },
    { header: '职务', accessor: 'job' },
    { header: '联系电话', accessor: 'phone' },
  ];
  const guideData = [{ id: 1, name: '张三', job: '指导员', phone: '13800000001' }];

  const gridColumns = [
    { header: '序号', accessor: 'id' },
    { header: '姓名', accessor: 'name' },
    { header: '职务', accessor: 'job' },
    { header: '手机号', accessor: 'phone' },
    { header: '包保网格', accessor: 'grid' },
  ];
  const gridData = [{ id: 1, name: '李四', job: '网格员', phone: '13900000002', grid: 'A区01网格' }];

  return (
    <div className="p-8">
      <PageHeader title="人员维护" />
      <div className="flex gap-4 mb-6 border-b dark:border-zinc-700 pb-2">
        <button 
            className={`px-4 py-2 ${activeTab === 'guide' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
            onClick={() => setActiveTab('guide')}
        >
            党建工作指导员
        </button>
        <button 
            className={`px-4 py-2 ${activeTab === 'grid' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
            onClick={() => setActiveTab('grid')}
        >
            社区网格员
        </button>
      </div>

      {activeTab === 'guide' && (
        <div>
           <div className="flex justify-between mb-4">
              <div className="flex gap-2">
                 <input type="text" placeholder="查询姓名" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
                 <button className="bg-blue-600 text-white px-4 py-2 rounded">查询</button>
              </div>
              <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded">新增</button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded">导入</button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded">导出</button>
              </div>
           </div>
           <Table columns={guideColumns} data={guideData} />
        </div>
      )}

      {activeTab === 'grid' && (
        <div>
            <div className="bg-white p-4 rounded shadow mb-6 dark:bg-zinc-900">
                <h3 className="font-medium mb-4">网格员维护</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="姓名" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
                    <input type="text" placeholder="职务" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
                    <input type="text" placeholder="手机号" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
                    <input type="text" placeholder="包保网格" className="border p-2 rounded dark:bg-zinc-800 dark:border-zinc-700" />
                    <div className="col-span-4 text-right">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">保存</button>
                    </div>
                </div>
            </div>
           <Table columns={gridColumns} data={gridData} />
        </div>
      )}
    </div>
  );
}
