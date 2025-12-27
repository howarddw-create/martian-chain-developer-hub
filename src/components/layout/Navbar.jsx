import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';
import { Menu, X, Book, Wrench, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Home', page: 'Home', icon: null },
  { label: 'Docs', page: 'DocsOverview', icon: Book },
  { label: 'Tools', page: 'ToolsNetworkRegistry', icon: Wrench },
  { label: 'Resources', page: 'Resources', icon: Link2 }
];

export default function Navbar({ currentPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-white hidden sm:block">Martian Chain</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  currentPage === item.page || currentPage?.startsWith('Docs') && item.page === 'DocsOverview'
                    ? "text-orange-400 bg-orange-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium",
                    currentPage === item.page
                      ? "text-orange-400 bg-orange-500/10"
                      : "text-slate-300 hover:bg-slate-800"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}