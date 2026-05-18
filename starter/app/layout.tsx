"use client";

import { RoleSwitcher } from "@/components/RoleSwitcher";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState("tech");

  useEffect(() => {
    // Poll for role changes from RoleSwitcher/localStorage
    const checkRole = () => setRole(localStorage.getItem("role") || "tech");
    window.addEventListener("storage", checkRole);
    const interval = setInterval(checkRole, 500);
    return () => { clearInterval(interval); window.removeEventListener("storage", checkRole); };
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="border-b bg-indigo-900 text-white shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold tracking-tight">Cerebras Tracker</Link>
              <nav className="flex gap-6 text-sm font-medium">
                {role === "tech" && <Link href="/tech" className="hover:text-indigo-200">Tech Workflows</Link>}
                {role === "manager" && <Link href="/manager" className="hover:text-indigo-200">Manager Dashboard</Link>}
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
