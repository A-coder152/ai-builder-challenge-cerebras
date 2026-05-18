import Link from "next/link";

export default function TechLanding() {
  const actions = [
    { href: '/tech/receive', label: 'Receive Asset', desc: 'Scan new arrivals' },
    { href: '/tech/store', label: 'Store Asset', desc: 'Move to storage' },
    { href: '/tech/deploy', label: 'Deploy Asset', desc: 'Move to service' },
    { href: '/tech/transfer', label: 'Transfer Custody', desc: 'Handoff to manager' },
  ];

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-indigo-900">Technician Terminal</h1>
      <div className="grid gap-4">
        {actions.map(a => (
          <Link key={a.href} href={a.href} className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 transition">
            <h2 className="text-lg font-bold text-gray-900">{a.label}</h2>
            <p className="text-sm text-gray-500">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
