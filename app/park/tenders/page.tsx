import React from 'react';
import { PageHeader } from '@/app/components/PageHeader';

export default function ParkDashboard() {
  const cards = [
    { title: '基本情况', value: '查看详情' },
    { title: '意见稿', value: '12 条未处理' },
    { title: '党建资讯', value: '最新更新: 10:00' },
    { title: '组织架构图', value: '查看' },
    { title: '数据分析', value: '查看报表' },
    { title: '红机党建工作指导员', value: '25 人' },
    { title: '标准化工业社区企业网格员', value: '15 人' },
    { title: 'GIS地图', value: '点击查看企业信息' },
  ];

  return (
    <div className="p-8">
      <PageHeader title="公开招标 / 园区概览" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow dark:bg-zinc-900 border dark:border-zinc-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{card.title}</h3>
            <p className="mt-2 text-2xl font-semibold text-blue-600">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
