import type { Metadata } from "next";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cerebras Asset Tracker",
  description: "Enterprise asset tracking and reconciliation system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="border-b bg-indigo-900 text-white shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold tracking-tight">Cerebras Tracker</Link>
              <nav className="flex gap-6 text-sm font-medium">
                <Link href="/tech" className="hover:text-indigo-200">Tech Workflows</Link>
                <Link href="/manager" className="hover:text-indigo-200">Manager Dashboard</Link>
              </nav>
            </div>
            <RoleSwitcher />
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
