import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Zap, Wallet, Server, Search, FileCode, 
  Code, Send, Radio, HelpCircle, History, ChevronDown
} from 'lucide-react';

const docsSections = [
  { 
    title: 'Getting Started',
    items: [
      { label: 'Overview', page: 'DocsOverview', icon: BookOpen },
      { label: 'Quickstart', page: 'DocsQuickstart', icon: Zap },
      { label: 'Connect Wallet', page: 'DocsWallet', icon: Wallet }
    ]
  },
  {
    title: 'Network',
    items: [
      { label: 'RPC & WebSocket', page: 'DocsRpc', icon: Server },
      { label: 'Explorer & Debugging', page: 'DocsExplorer', icon: Search },
      { label: 'Contracts & Addresses', page: 'DocsContracts', icon: FileCode }
    ]
  },
  {
    title: 'Dev Recipes',
    items: [
      { label: 'Read Data (viem)', page: 'DocsRecipeRead', icon: Code },
      { label: 'Send TX (ethers)', page: 'DocsRecipeSend', icon: Send },
      { label: 'Subscribe to Events', page: 'DocsRecipeEvents', icon: Radio }
    ]
  },
  {
    title: 'Support',
    items: [
      { label: 'Troubleshooting', page: 'DocsTroubleshooting', icon: HelpCircle },
      { label: 'Changelog', page: 'DocsChangelog', icon: History }
    ]
  }
];

export default function Sidebar({ currentPage }) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 overflow-y-auto">
      <nav className="p-4 space-y-6">
        {docsSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.page;
                return (
                  <li key={item.page}>
                    <Link
                      to={createPageUrl(item.page)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors",
                        isActive 
                          ? "bg-orange-500/10 text-orange-400 font-medium"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}