import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Download, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeBlock from '@/components/ui/CodeBlock';
import CopyButton from '@/components/ui/CopyButton';

export default function ToolsExport() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];

  const getExportJson = () => {
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
      explorerUrl: config.explorerUrl,
      identifiers: {
        subnetId: config.subnetId,
        blockchainId: config.blockchainId,
        conversionTxId: config.conversionTxId
      },
      contracts: {
        validatorMessagesLibrary: config.validatorMessagesLibraryAddress,
        validatorManager: config.validatorManagerContractAddress
      },
      owners: {
        cChain: config.ownerAddressCChain,
        pChain: config.ownerAddressPChain
      },
      networkParameters: {
        blockTimeSeconds: config.blockTimeSeconds,
        gasLimit: config.gasLimit,
        baseFeeGwei: config.baseFeeGwei
      }
    }, null, 2);
  };

  const downloadJson = () => {
    const json = getExportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `martian-chain-network-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Export Network JSON</h1>
          <p className="text-slate-400">
            Download or copy the complete network configuration for use in SDKs, scripts, or documentation.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <FileJson className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Network Configuration</h2>
                <p className="text-sm text-slate-400">Complete Martian Chain parameters</p>
              </div>
            </div>
            <div className="flex gap-2">
              <CopyButton text={getExportJson()} className="h-9 px-4 w-auto border border-slate-700" />
              <Button onClick={downloadJson} className="bg-orange-500 hover:bg-orange-600">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>

          <CodeBlock code={getExportJson()} language="json" />
        </div>

        {/* Use Cases */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-white font-medium mb-2">SDK Configuration</h3>
            <p className="text-slate-400 text-sm">
              Use this JSON to configure Web3 libraries and custom SDKs with Martian Chain parameters.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-white font-medium mb-2">CI/CD Pipelines</h3>
            <p className="text-slate-400 text-sm">
              Import network constants into your deployment scripts and test suites.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-white font-medium mb-2">Documentation</h3>
            <p className="text-slate-400 text-sm">
              Single source of truth for generating docs, ensuring consistency across all materials.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-white font-medium mb-2">Tooling Integration</h3>
            <p className="text-slate-400 text-sm">
              Feed into explorers, wallets, monitoring tools, and other infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}