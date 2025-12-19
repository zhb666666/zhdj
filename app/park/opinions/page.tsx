import React from 'react';
import { Table } from '@/app/components/Table';
import { PageHeader } from '@/app/components/PageHeader';

export default function ParkOpinionsPage() {
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
    { id: 3, subject: '路灯维修', content: 'A区路灯损坏...', organization: '某物流公司', submitTime: '2023-10-06' },
  ];

  return (
    <div className="p-8">
      <PageHeader title="意见稿管理 (园区端)" />
      <Table columns={columns} data={data} />
    </div>
  );
}
