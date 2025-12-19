import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">党建系统集成平台</h1>
        <p className="text-gray-600 dark:text-gray-400">选择您的角色进入系统</p>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Enterprise Platform */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">企业用统平台</h2>
          <div className="space-y-4">
             <Link href="/enterprise/opinions" className="block p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-zinc-700 transition">
                <h3 className="font-medium text-lg">意见稿模块</h3>
                <p className="text-sm text-gray-500">提交和查看意见稿</p>
             </Link>
             <Link href="/enterprise/notices" className="block p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-zinc-700 transition">
                <h3 className="font-medium text-lg">通知公告</h3>
                <p className="text-sm text-gray-500">查看最新通知和公告</p>
             </Link>
          </div>
        </div>

        {/* Park Platform */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold mb-6 text-green-600">园区用统平台</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Link href="/park/tenders" className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 transition">
                <h3 className="font-medium">公开招标/概览</h3>
             </Link>
             <Link href="/park/basic-info" className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 transition">
                <h3 className="font-medium">基本情况维护</h3>
             </Link>
             <Link href="/park/opinions" className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 transition">
                <h3 className="font-medium">意见稿管理</h3>
             </Link>
             <Link href="/park/news" className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 transition">
                <h3 className="font-medium">党建资讯</h3>
             </Link>
             <Link href="/park/notices" className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 transition">
                <h3 className="font-medium">通知公告管理</h3>
             </Link>
             <Link href="/park/organizations" className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 transition">
                <h3 className="font-medium">组织机构维护</h3>
             </Link>
             <Link href="/park/personnel" className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 transition">
                <h3 className="font-medium">人员维护</h3>
             </Link>
              <Link href="/park/members" className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 transition">
                <h3 className="font-medium">党员维护</h3>
             </Link>
             <Link href="/park/statistics" className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-zinc-700 transition col-span-2 text-center">
                <h3 className="font-medium">统计分析</h3>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
