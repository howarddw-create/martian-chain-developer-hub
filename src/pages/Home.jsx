import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ExternalLink, Activity, Zap, Box, Fuel, Coins, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NetworkStatsGrid from '@/components/docs/NetworkStatsGrid';

export default function Home() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Mainnet Live
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Martian Chain
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                High-Performance L1 for Builders
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
              Fast blocks, low fees, full EVM compatibility. Deploy your contracts and build the future.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl('DocsOverview')}>
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  Read Docs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <a href={config?.explorerUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800">
                  Open Explorer <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              
              <Link to={createPageUrl('ToolsRpcHealth')}>
                <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800">
                  <Activity className="mr-2 h-4 w-4" /> RPC Health
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Network Stats */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-xl font-semibold text-white mb-6 text-center">Network at a Glance</h2>
        {config && <NetworkStatsGrid config={config} />}
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Zap}
            title="2-Second Blocks"
            description="Fast finality for responsive applications and real-time experiences."
          />
          <FeatureCard
            icon={Fuel}
            title="25 Gwei Base Fee"
            description="Predictable, low-cost transactions that won't break your budget."
          />
          <FeatureCard
            icon={Box}
            title="EVM Compatible"
            description="Deploy existing Solidity contracts with zero modifications."
          />
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <QuickLinkCard
            title="Start Building"
            description="5-minute quickstart guide to deploy your first contract"
            linkText="View Quickstart"
            linkPage="DocsQuickstart"
          />
          <QuickLinkCard
            title="Add to Wallet"
            description="One-click MetaMask setup or manual configuration"
            linkText="Connect Wallet"
            linkPage="DocsWallet"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-orange-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function QuickLinkCard({ title, description, linkText, linkPage }) {
  return (
    <Link 
      to={createPageUrl(linkPage)}
      className="block p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-orange-500/50 transition-all group"
    >
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <span className="text-orange-400 text-sm font-medium inline-flex items-center group-hover:gap-2 transition-all">
        {linkText} <ArrowRight className="h-4 w-4 ml-1" />
      </span>
    </Link>
  );
}