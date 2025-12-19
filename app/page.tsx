import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="mb-10 text-4xl font-bold text-gray-900">Party Building System</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link href="/enterprise" className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50 hover:shadow-md transition">
          <h2 className="mb-2 text-2xl font-semibold text-blue-600">Enterprise User System Platform</h2>
          <p className="text-gray-600">Access enterprise modules including Opinion Drafts and Notices.</p>
        </Link>
        
        <Link href="/park" className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50 hover:shadow-md transition">
          <h2 className="mb-2 text-2xl font-semibold text-green-600">Park User System Platform</h2>
          <p className="text-gray-600">Access park management modules including Tenders, News, and Personnel.</p>
        </Link>
      </div>
    </div>
  );
}
