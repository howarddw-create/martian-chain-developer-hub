import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeBlock from '@/components/ui/CodeBlock';
import Callout from '@/components/ui/Callout';
import ValueDisplay from '@/components/ui/ValueDisplay';
import AddToMetaMaskButton from '@/components/docs/AddToMetaMaskButton';

export default function DocsWallet() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];

  const addNetworkCode = `// Add Martian Chain to MetaMask
async function addMartianChain() {
  if (!window.ethereum) {
    alert('Please install MetaMask');
    return;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '${config?.chainIdHex || '0x7EB'}',
        chainName: '${config?.chainName || 'Martian Chain'}',
        nativeCurrency: {
          name: '${config?.nativeTokenName || 'Erol Musk'}',
          symbol: '${config?.nativeTokenSymbol || 'EROL'}',
          decimals: 18  // Standard EVM default
        },
        rpcUrls: ['${config?.rpcUrls?.[0] || 'https://rpc1.martianchain.com'}'],
        blockExplorerUrls: ['${config?.explorerUrl || 'https://explorer.martianchain.com'}']
      }]
    });
    console.log('Network added!');
  } catch (error) {
    console.error('Failed to add network:', error);
  }
}`;

  const downloadConfig = () => {
    if (!config) return;
    const configJson = JSON.stringify({
      chainName: config.chainName,
      chainId: config.chainIdDecimal,
      chainIdHex: config.chainIdHex,
      nativeCurrency: {
        name: config.nativeTokenName,
        symbol: config.nativeTokenSymbol,
        decimals: 18
      },
      rpcUrls: config.rpcUrls,
      blockExplorerUrls: [config.explorerUrl]
    }, null, 2);

    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'martian-chain-wallet-config.json';
    a.click();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Connect Wallet</h1>
      <p className="text-slate-400 mb-8">Add Martian Chain to MetaMask or any EVM-compatible wallet.</p>

      {/* One-Click Add */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Add</h2>
        <p className="text-slate-400 mb-4">
          Click the button below to automatically add Martian Chain to MetaMask.
        </p>
        
        {config && (
          <div className="flex gap-3">
            <AddToMetaMaskButton config={config} />
            <Button variant="outline" className="border-slate-700" onClick={downloadConfig}>
              <Download className="h-4 w-4 mr-2" /> Download Config
            </Button>
          </div>
        )}

        <Callout type="note" title="Decimals">
          Native currency uses 18 decimals (standard EVM default). Change only if Martian Chain differs.
        </Callout>
      </section>

      {/* Manual Configuration */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Manual Configuration</h2>
        <p className="text-slate-400 mb-4">
          Use these values to manually add the network in your wallet settings.
        </p>

        <div className="space-y-3 mb-6">
          <ValueDisplay label="Network Name" value={config?.chainName} />
          <ValueDisplay label="Chain ID" value={config?.chainIdDecimal?.toString()} />
          <ValueDisplay label="Currency Symbol" value={config?.nativeTokenSymbol} />
          <ValueDisplay label="Block Explorer" value={config?.explorerUrl} />
        </div>

        <h3 className="text-lg font-medium text-white mb-3">RPC URLs (use any one)</h3>
        <div className="space-y-2">
          {config?.rpcUrls?.map((url, i) => (
            <ValueDisplay key={i} label={`RPC ${i + 1}`} value={url} />
          ))}
        </div>
      </section>

      {/* Code Snippet */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">JavaScript Snippet</h2>
        <p className="text-slate-400 mb-4">
          Add this to your dApp to let users connect with one click.
        </p>
        <CodeBlock code={addNetworkCode} title="addNetwork.js" />
      </section>

      <Callout type="tip" title="Multiple RPC Endpoints">
      Multiple RPC endpoints are provided for redundancy. If one is slow, try another.
      </Callout>
    </div>
  );
}