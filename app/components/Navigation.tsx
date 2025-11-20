'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    // Workspace hidden from nav but accessible at /workspace
    { href: '/analytics', label: 'Analytics' },
    { href: '/upload', label: 'Upload' },
    { href: '/documentation', label: 'Documentation' },
  ];

  return (
    <header className="bg-white border-b border-cream-300 px-4 sm:px-8 py-3 sm:py-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <Brain className="text-cream-500" size={24} />
            <h1 className="text-base sm:text-lg font-medium text-cream-900">Verity</h1>
          </Link>

          {/* Right section - User - Simplified on mobile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-sm text-gray-600">Courtney Kingsbury</div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cream-400 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
              CK
            </div>
          </div>
        </div>

        {/* Navigation links - Full width on mobile */}
        <nav className="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs sm:text-sm transition-colors whitespace-nowrap ${
                pathname === link.href
                  ? 'text-cream-900 font-medium border-b-2 border-cream-500 pb-1'
                  : 'text-gray-600 hover:text-cream-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
