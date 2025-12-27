import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Globe, FileText, Twitter, Github, MessageCircle, Award } from 'lucide-react';

export default function Resources() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];

  const officialLinks = [
    {
      title: 'Official Website',
      description: 'Learn more about Martian Chain',
      url: config?.websiteUrl || 'https://martianchain.com',
      icon: Globe
    },
    {
      title: 'Documentation',
      description: 'Developer guides and API references',
      url: config?.docsUrl || 'https://docs.martianchain.com',
      icon: FileText
    },
    {
      title: 'Block Explorer',
      description: 'View transactions and addresses',
      url: config?.explorerUrl || 'https://explorer.martianchain.com',
      icon: ExternalLink
    }
  ];

  const avalancheLinks = [
    {
      title: 'Retro9000',
      description: 'Avalanche L1 builder incentive program',
      url: 'https://www.avax.network/retro9000',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Resources</h1>
          <p className="text-slate-400">
            Official links, community channels, and ecosystem resources.
          </p>
        </div>

        {/* Official Links */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Official Links</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {officialLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-slate-900/50 border border-slate-800 hover:border-orange-500/50 rounded-xl p-6 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                      <Icon className="h-5 w-5 text-orange-400" />
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-600 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h3 className="text-white font-semibold mb-1 group-hover:text-orange-400 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{link.description}</p>
                </a>
              );
            })}
          </div>
        </section>

        {/* Ecosystem & Grants */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Ecosystem & Grants</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {avalancheLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-orange-500/50 rounded-xl p-6 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                      <Icon className="h-5 w-5 text-orange-400" />
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-600 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h3 className="text-white font-semibold mb-1 group-hover:text-orange-400 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{link.description}</p>
                </a>
              );
            })}
          </div>
        </section>

        {/* Dev Tools */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Developer Tools</h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <ul className="space-y-3">
              <li className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div>
                  <p className="text-white font-medium">RPC Health Checker</p>
                  <p className="text-slate-400 text-sm">Monitor endpoint status</p>
                </div>
                <a href="/tools/rpc-health" className="text-orange-400 hover:text-orange-300 text-sm">
                  Check Now →
                </a>
              </li>
              <li className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div>
                  <p className="text-white font-medium">Network Registry</p>
                  <p className="text-slate-400 text-sm">View all network constants</p>
                </div>
                <a href="/tools/network-registry" className="text-orange-400 hover:text-orange-300 text-sm">
                  View Registry →
                </a>
              </li>
              <li className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">Export Network JSON</p>
                  <p className="text-slate-400 text-sm">Download config for SDKs</p>
                </div>
                <a href="/tools/export" className="text-orange-400 hover:text-orange-300 text-sm">
                  Export →
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}