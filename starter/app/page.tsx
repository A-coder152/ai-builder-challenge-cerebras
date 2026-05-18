import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">Cerebras Asset Command</h1>
        <p className="text-xl text-gray-600 mt-4">Unified visibility across Operations, Facilities, and Finance.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technician Terminal</h2>
          <p className="text-gray-600 mb-8">Perform rapid barcode scans for asset lifecycle management.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/tech/receive', label: 'Receive' },
              { href: '/tech/store', label: 'Store' },
              { href: '/tech/deploy', label: 'Deploy' },
              { href: '/tech/transfer', label: 'Transfer' },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="bg-indigo-50 text-indigo-900 py-4 rounded-xl font-bold hover:bg-indigo-100 transition text-center">
                {action.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Hub</h2>
          <p className="text-gray-600 mb-8">Monitor fleet health, triage exceptions, and audit reconciliation.</p>
          <div className="space-y-4">
            <Link href="/manager" className="block w-full bg-indigo-900 text-white py-4 rounded-xl font-bold hover:bg-indigo-800 transition text-center">
              Go to Dashboard
            </Link>
            <Link href="/manager/reconcile" className="block w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-200 transition text-center">
              Reconciliation Report
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
