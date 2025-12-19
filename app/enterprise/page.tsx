import Link from "next/link";

export default function EnterpriseDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Enterprise User Platform</h1>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/enterprise/opinions" className="block rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-gray-800">Opinion Draft Module</h3>
          <p className="mt-2 text-gray-600">Manage opinion drafts, submit new opinions, and view history.</p>
        </Link>

        <Link href="/enterprise/notices" className="block rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-gray-800">Notices & Announcements</h3>
          <p className="mt-2 text-gray-600">View and search system notifications and announcements.</p>
        </Link>
      </div>
    </div>
  );
}
