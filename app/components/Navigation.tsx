'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/workspace', label: 'Workspace' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/upload', label: 'Upload' },
    { href: '/documentation', label: 'Documentation' },
  ];

  return (
    <header className="bg-white border-b border-cream-300 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Brain className="text-cream-500" size={28} />
          <h1 className="text-lg font-medium text-cream-900">Business Intelligence Suite</h1>
        </Link>

        {/* Center section - Navigation links */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? 'text-cream-900 font-medium border-b-2 border-cream-500 pb-1'
                  : 'text-gray-600 hover:text-cream-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right section - User */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Courtney Kingsbury</div>
          <div className="w-10 h-10 rounded-full bg-cream-400 flex items-center justify-center text-white font-semibold text-sm">
            CK
          </div>
        </div>
      </div>
    </header>
  );
}
