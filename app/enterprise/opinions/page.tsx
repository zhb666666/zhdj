import React from 'react';
import Link from 'next/link';
import { Table } from '@/app/components/Table';
import { PageHeader } from '@/app/components/PageHeader';

export default function OpinionsPage() {
  const columns = [
    { header: '序号', accessor: 'id' },
    { header: '意见主题', accessor: 'subject' },
    { header: '意见内容', accessor: 'content' },
    { header: '所属机构', accessor: 'organization' },
    { header: '提交时间', accessor: 'submitTime' },
  ];

  const data = [
    { id: 1, subject: '关于园区建设的建议', content: '建议增加绿化...', organization: '某科技公司', submitTime: '2023-10-01' },
    { id: 2, subject: '食堂伙食改进', content: '菜品太单一...', organization: '某软件公司', submitTime: '2023-10-05' },
  ];

  return (
    <div className="p-8">
      <PageHeader 
        title="意见稿列表" 
        action={
          <Link href="/enterprise/opinions/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            新增意见稿
          </Link>
        }
      />
      <Table columns={columns} data={data} />
    </div>
  );
}
