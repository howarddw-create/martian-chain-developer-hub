import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import Callout from '@/components/ui/Callout';
import DocsTabs from '@/components/docs/DocsTabs';

export default function DocsRecipeSend() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];
  const rpcUrl = config?.rpcUrls?.[0] || 'https://rpc1.martianchain.com';
  const chainId = config?.chainIdDecimal || 1681717;

  const ethersTransferExample = `import { ethers } from 'ethers';

// Connect wallet (MetaMask or other)
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Prepare transaction
const tx = {
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
  value: ethers.parseEther('0.1'), // 0.1 ${config?.nativeTokenSymbol || 'MRTN'}
  chainId: ${chainId}
};

// Send transaction
const txResponse = await signer.sendTransaction(tx);
console.log('Transaction hash:', txResponse.hash);

// Wait for confirmation
const receipt = await txResponse.wait();
console.log('Transaction confirmed in block:', receipt.blockNumber);
console.log('Gas used:', receipt.gasUsed.toString());`;

  const viemTransferExample = `import { createWalletClient, custom, parseEther } from 'viem';
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
  },
});

const client = createWalletClient({
  chain: martianChain,
  transport: custom(window.ethereum)
});

const [address] = await client.requestAddresses();

// Send transaction
const hash = await client.sendTransaction({
  account: address,
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
  value: parseEther('0.1')
});

console.log('Transaction hash:', hash);`;

  const contractCallExample = `import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// ERC-20 token ABI (minimal)
const abi = [
  'function transfer(address to, uint256 amount) returns (bool)'
];

const tokenAddress = '0x...'; // Your token contract
const contract = new ethers.Contract(tokenAddress, abi, signer);

// Call contract method
const tx = await contract.transfer(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
  ethers.parseUnits('100', 18)
);

const receipt = await tx.wait();
console.log('Transfer completed:', receipt.hash);`;

  const estimateGasExample = `// Estimate gas before sending
const gasEstimate = await provider.estimateGas(tx);
console.log('Estimated gas:', gasEstimate.toString());

// Get current gas price
const feeData = await provider.getFeeData();
console.log('Gas price:', feeData.gasPrice.toString());
console.log('Max fee:', feeData.maxFeePerGas.toString());

// Send with custom gas settings
const txResponse = await signer.sendTransaction({
  ...tx,
  gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
  maxFeePerGas: feeData.maxFeePerGas,
  maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
});`;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">Send Transactions</h1>
      <p className="text-slate-300 text-lg mb-8">
        Sign and broadcast transactions to Martian Chain.
      </p>

      <Callout type="warning" title="Testnet Recommended">
        <AlertTriangle className="h-4 w-4 inline mr-1" />
        Always test on testnet first. Ensure you have sufficient {config?.nativeTokenSymbol || 'MRTN'} for gas fees.
      </Callout>

      {/* Transfer Native Tokens */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Transfer Native Tokens</h2>
        <p className="text-slate-300 mb-4">
          Send {config?.nativeTokenSymbol || 'MRTN'} to another address:
        </p>

        <DocsTabs
          tabs={[
            { label: 'ethers.js', value: 'ethers' },
            { label: 'viem', value: 'viem' },
          ]}
          defaultValue="ethers"
        >
          <div data-tab="ethers">
            <CodeBlock code={ethersTransferExample} language="javascript" title="ethers.js Transfer" />
          </div>
          <div data-tab="viem">
            <CodeBlock code={viemTransferExample} language="javascript" title="viem Transfer" />
          </div>
        </DocsTabs>
      </section>

      {/* Contract Interaction */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Interact with Smart Contracts</h2>
        <p className="text-slate-300 mb-4">
          Call contract methods that modify state:
        </p>
        <CodeBlock code={contractCallExample} language="javascript" title="Contract Interaction" />
      </section>

      {/* Gas Estimation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Gas Estimation & Optimization</h2>
        <p className="text-slate-300 mb-4">
          Estimate gas costs before sending transactions:
        </p>
        <CodeBlock code={estimateGasExample} language="javascript" title="Gas Estimation" />
        
        <Callout type="tip" title="Gas Optimization Tips">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Add a 10-20% buffer to gas estimates to avoid out-of-gas errors</li>
            <li>Base fee on Martian Chain: {config?.baseFeeGwei || '25'} gwei</li>
            <li>Block gas limit: {config?.gasLimit?.toLocaleString() || '8,000,000'}</li>
            <li>Use batch transactions when possible to save gas</li>
          </ul>
        </Callout>
      </section>

      {/* Transaction Lifecycle */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Transaction Lifecycle</h2>
        <div className="space-y-3">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 font-semibold">
                1
              </div>
              <h3 className="text-white font-semibold">Create & Sign</h3>
            </div>
            <p className="text-slate-400 text-sm ml-11">
              Prepare transaction data and sign with your private key via wallet.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 font-semibold">
                2
              </div>
              <h3 className="text-white font-semibold">Broadcast</h3>
            </div>
            <p className="text-slate-400 text-sm ml-11">
              Send signed transaction to RPC endpoint. Receive transaction hash.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 font-semibold">
                3
              </div>
              <h3 className="text-white font-semibold">Pending</h3>
            </div>
            <p className="text-slate-400 text-sm ml-11">
              Transaction waits in mempool to be included in a block.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 font-semibold">
                4
              </div>
              <h3 className="text-white font-semibold">Confirmed</h3>
            </div>
            <p className="text-slate-400 text-sm ml-11">
              Transaction included in block. Receipt available with status and gas used.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-orange-500/10 to-slate-900/50 border border-orange-500/20 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          Next: Listen to Events
          <ArrowRight className="h-5 w-5 text-orange-400" />
        </h3>
        <p className="text-slate-300 mb-4">
          Subscribe to real-time blockchain events and contract logs.
        </p>
        <Link 
          to={createPageUrl('DocsRecipeEvents')}
          className="text-orange-400 hover:text-orange-300 font-medium"
        >
          View Events Guide →
        </Link>
      </div>
    </div>
  );
}