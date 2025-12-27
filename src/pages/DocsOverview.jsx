import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ValueDisplay from '@/components/ui/ValueDisplay';
import CopyButton from '@/components/ui/CopyButton';

export default function DocsOverview() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];

  const getNetworkJson = () => {
    if (!config) return '';
    return JSON.stringify({
      chainName: config.chainName,
      chainId: config.chainIdDecimal,
      chainIdHex: config.chainIdHex,
      nativeToken: {
        name: config.nativeTokenName,
        symbol: config.nativeTokenSymbol,
        totalSupply: config.nativeTokenTotalSupply
      },
      rpcUrls: config.rpcUrls,
      wsUrls: config.wsUrls,
      explorerUrl: config.explorerUrl
    }, null, 2);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Welcome to Martian Chain Docs</h1>
      <p className="text-slate-400 mb-8">Everything you need to build on Martian Chain.</p>

      {/* Quick Start Checklist */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Start Checklist</h2>
        <div className="space-y-3">
          <ChecklistItem 
            step="1" 
            title="Add Network to Wallet" 
            description="Configure MetaMask or your preferred wallet"
            linkPage="DocsWallet"
          />
          <ChecklistItem 
            step="2" 
            title="Test RPC Connection" 
            description="Verify your RPC endpoint is working"
            linkPage="DocsRpc"
          />
          <ChecklistItem 
            step="3" 
            title="Deploy a Contract" 
            description="Use Hardhat or Foundry to deploy"
            linkPage="DocsQuickstart"
          />
        </div>
      </div>

      {/* Network Config Widget */}
      {config && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Network Config</h2>
            <div className="flex gap-2">
              <CopyButton text={getNetworkJson()} className="h-8 px-3 w-auto" />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const blob = new Blob([getNetworkJson()], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'martian-chain-config.json';
                  a.click();
                }}
                className="border-slate-700"
              >
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>
          
          <div className="grid gap-3">
            <ValueDisplay label="Primary RPC" value={config.rpcUrls?.[0]} />
            <ValueDisplay label="Chain ID" value={`${config.chainIdDecimal} (${config.chainIdHex})`} />
            <ValueDisplay label="Explorer" value={config.explorerUrl} />
          </div>
        </div>
      )}

      {/* Core Docs Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <DocLink 
          title="Connect Wallet" 
          description="Add Martian Chain to MetaMask"
          page="DocsWallet"
        />
        <DocLink 
          title="RPC & WebSocket" 
          description="Endpoints and code examples"
          page="DocsRpc"
        />
        <DocLink 
          title="Explorer & Debugging" 
          description="View transactions and debug issues"
          page="DocsExplorer"
        />
        <DocLink 
          title="Contracts & Addresses" 
          description="System contract addresses"
          page="DocsContracts"
        />
      </div>
    </div>
  );
}

function ChecklistItem({ step, title, description, linkPage }) {
  return (
    <Link 
      to={createPageUrl(linkPage)}
      className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors group"
    >
      <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 text-orange-400 font-semibold text-sm">
        {step}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-medium group-hover:text-orange-400 transition-colors">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-orange-400 transition-colors" />
    </Link>
  );
}

function DocLink({ title, description, page }) {
  return (
    <Link 
      to={createPageUrl(page)}
      className="p-4 rounded-lg border border-slate-800 hover:border-orange-500/50 transition-colors group"
    >
      <h3 className="text-white font-medium mb-1 group-hover:text-orange-400 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </Link>
  );
}