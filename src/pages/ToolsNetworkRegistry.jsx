import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Database } from 'lucide-react';
import ValueDisplay from '@/components/ui/ValueDisplay';

export default function ToolsNetworkRegistry() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Network Registry</h1>
          <p className="text-slate-400">Single source of truth for Martian Chain constants.</p>
        </div>

        {config ? (
          <div className="space-y-8">
            {/* Chain Info */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-400" />
                Chain Information
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                <ValueDisplay label="Chain Name" value={config.chainName} />
                <ValueDisplay label="Chain ID (Decimal)" value={config.chainIdDecimal?.toString()} />
                <ValueDisplay label="Chain ID (Hex)" value={config.chainIdHex} />
                <ValueDisplay label="Block Time" value={`${config.blockTimeSeconds}s`} />
                <ValueDisplay label="Gas Limit" value={config.gasLimit?.toLocaleString()} />
                <ValueDisplay label="Base Fee" value={`${config.baseFeeGwei} gwei`} />
              </div>
            </section>

            {/* Native Token */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Native Token</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <ValueDisplay label="Name" value={config.nativeTokenName} />
                <ValueDisplay label="Symbol" value={config.nativeTokenSymbol} />
                <ValueDisplay label="Total Supply" value={config.nativeTokenTotalSupply} />
              </div>
            </section>

            {/* Network Identifiers */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Network Identifiers</h2>
              <div className="space-y-3">
                <ValueDisplay label="Subnet ID" value={config.subnetId} />
                <ValueDisplay label="Blockchain ID" value={config.blockchainId} />
                <ValueDisplay label="Conversion TX ID" value={config.conversionTxId} />
              </div>
            </section>

            {/* System Contracts */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">System Contracts</h2>
              <div className="space-y-3">
                <ValueDisplay label="Validator Messages Library" value={config.validatorMessagesLibraryAddress} />
                <ValueDisplay label="Validator Manager Contract" value={config.validatorManagerContractAddress} />
              </div>
            </section>

            {/* Owner Addresses */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Owner Addresses</h2>
              <div className="space-y-3">
                <ValueDisplay label="Owner (C-Chain)" value={config.ownerAddressCChain} />
                <ValueDisplay label="Owner (P-Chain)" value={config.ownerAddressPChain} />
              </div>
            </section>

            {/* RPC URLs */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">RPC Endpoints</h2>
              <div className="space-y-2">
                {config.rpcUrls?.map((url, i) => (
                  <ValueDisplay key={i} label={`RPC ${i + 1}`} value={url} />
                ))}
              </div>
            </section>

            {/* WebSocket URLs */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">WebSocket Endpoints</h2>
              <div className="space-y-2">
                {config.wsUrls?.map((url, i) => (
                  <ValueDisplay key={i} label={`WS ${i + 1}`} value={url} />
                ))}
              </div>
            </section>

            {/* URLs */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Links</h2>
              <div className="space-y-3">
                <ValueDisplay label="Explorer" value={config.explorerUrl} />
                <ValueDisplay label="Website" value={config.websiteUrl} />
                <ValueDisplay label="Docs" value={config.docsUrl} />
              </div>
            </section>
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400">Loading network configuration...</p>
          </div>
        )}
      </div>
    </div>
  );
}