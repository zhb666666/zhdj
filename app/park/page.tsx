import Link from "next/link";

export default function ParkDashboard() {
  const modules = [
    { name: "Public Tender", path: "/park/tenders", desc: "View tenders, data analysis, and grid information." },
    { name: "Basic Info Maintenance", path: "/park/basic-info", desc: "Manage key enterprise and party organization data." },
    { name: "Opinion Draft Module", path: "/park/opinions", desc: "View and manage opinion drafts." },
    { name: "Party Building News", path: "/park/news", desc: "Publish and view party building news." },
    { name: "Notices & Announcements", path: "/park/notices", desc: "Manage and view notices." },
    { name: "Organization Maintenance", path: "/park/organizations", desc: "Maintain organizational structure and codes." },
    { name: "Personnel Maintenance", path: "/park/personnel", desc: "Manage party instructors and grid workers." },
    { name: "Statistical Analysis", path: "/park/statistics", desc: "Data analysis and verification." },
    { name: "Party Member Maintenance", path: "/park/members", desc: "Manage party member information." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Park User Platform</h1>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Link key={mod.path} href={mod.path} className="block rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-800">{mod.name}</h3>
            <p className="mt-2 text-gray-600">{mod.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
