import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import Callout from '@/components/ui/Callout';
import DocsTabs from '@/components/docs/DocsTabs';

export default function DocsRecipeRead() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];
  const rpcUrl = config?.rpcUrls?.[0] || 'https://rpc1.martianchain.com';
  const chainId = config?.chainIdDecimal || 1681717;

  const curlExample = `curl -X POST ${rpcUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2", "latest"],
    "id": 1
  }'`;

  const ethersExample = `import { ethers } from 'ethers';

// Connect to Martian Chain
const provider = new ethers.JsonRpcProvider('${rpcUrl}');

// Get latest block number
const blockNumber = await provider.getBlockNumber();
console.log('Latest block:', blockNumber);

// Get account balance
const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2';
const balance = await provider.getBalance(address);
console.log('Balance:', ethers.formatEther(balance), '${config?.nativeTokenSymbol || 'MRTN'}');

// Get transaction by hash
const txHash = '0x...';
const tx = await provider.getTransaction(txHash);
console.log('Transaction:', tx);

// Get block with transactions
const block = await provider.getBlock('latest', true);
console.log('Latest block transactions:', block.transactions.length);

// Get transaction receipt
const receipt = await provider.getTransactionReceipt(txHash);
console.log('Status:', receipt.status === 1 ? 'Success' : 'Failed');
console.log('Gas used:', receipt.gasUsed.toString());`;

  const viemExample = `import { createPublicClient, http, formatEther } from 'viem';
import { defineChain } from 'viem';

const martianChain = defineChain({
  id: ${chainId},
  name: '${config?.chainName || 'Martian Chain'}',
  network: 'martian',
  nativeCurrency: {
    decimals: 18,
    name: '${config?.nativeTokenName || 'Martian'}',
    symbol: '${config?.nativeTokenSymbol || 'MRTN'}',
  },
  rpcUrls: {
    default: { http: ['${rpcUrl}'] },
    public: { http: ['${rpcUrl}'] },
  },
});

const client = createPublicClient({
  chain: martianChain,
  transport: http()
});

// Get latest block number
const blockNumber = await client.getBlockNumber();
console.log('Latest block:', blockNumber);

// Get account balance
const balance = await client.getBalance({ 
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2' 
});
console.log('Balance:', formatEther(balance), '${config?.nativeTokenSymbol || 'MRTN'}');

// Get transaction
const tx = await client.getTransaction({ 
  hash: '0x...' 
});

// Get block with transactions
const block = await client.getBlock({ 
  blockTag: 'latest',
  includeTransactions: true 
});

// Get transaction receipt
const receipt = await client.getTransactionReceipt({ 
  hash: '0x...' 
});
console.log('Status:', receipt.status);`;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">Read Blockchain Data</h1>
      <p className="text-slate-300 text-lg mb-8">
        Query blocks, balances, and transactions from Martian Chain.
      </p>

      <Callout type="tip" title="Before You Start">
        Make sure you've connected to Martian Chain RPC. See the{' '}
        <Link to={createPageUrl('DocsRpc')} className="text-orange-400 hover:underline">
          RPC Documentation
        </Link>{' '}
        for connection details.
      </Callout>

      {/* Using curl */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Using curl</h2>
        <p className="text-slate-300 mb-4">
          Make raw JSON-RPC calls to read blockchain state:
        </p>
        <CodeBlock code={curlExample} language="bash" />
      </section>

      {/* Using JavaScript Libraries */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Using JavaScript Libraries</h2>
        <p className="text-slate-300 mb-4">
          Read blockchain data with popular Web3 libraries:
        </p>

        <DocsTabs
          tabs={[
            { label: 'ethers.js', value: 'ethers' },
            { label: 'viem', value: 'viem' },
          ]}
          defaultValue="ethers"
        >
          <div data-tab="ethers">
            <CodeBlock code={ethersExample} language="javascript" title="ethers.js" />
          </div>
          <div data-tab="viem">
            <CodeBlock code={viemExample} language="javascript" title="viem" />
          </div>
        </DocsTabs>
      </section>

      {/* Common Read Operations */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Common Read Operations</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-white font-semibold mb-2">eth_blockNumber</h3>
            <p className="text-slate-400 text-sm">Get the latest block number</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-white font-semibold mb-2">eth_getBalance</h3>
            <p className="text-slate-400 text-sm">Check account balance</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-white font-semibold mb-2">eth_getTransaction</h3>
            <p className="text-slate-400 text-sm">Get transaction details by hash</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-white font-semibold mb-2">eth_getTransactionReceipt</h3>
            <p className="text-slate-400 text-sm">Get transaction execution result</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-white font-semibold mb-2">eth_getBlock</h3>
            <p className="text-slate-400 text-sm">Get block details with or without transactions</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-white font-semibold mb-2">eth_call</h3>
            <p className="text-slate-400 text-sm">Call contract view functions</p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-orange-500/10 to-slate-900/50 border border-orange-500/20 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          Next: Send Transactions
          <ArrowRight className="h-5 w-5 text-orange-400" />
        </h3>
        <p className="text-slate-300 mb-4">
          Learn how to sign and send transactions to Martian Chain.
        </p>
        <Link 
          to={createPageUrl('DocsRecipeSend')}
          className="text-orange-400 hover:text-orange-300 font-medium"
        >
          View Transaction Guide →
        </Link>
      </div>
    </div>
  );
}