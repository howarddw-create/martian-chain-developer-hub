import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Callout from '@/components/ui/Callout';
import CodeBlock from '@/components/ui/CodeBlock';

export default function DocsTroubleshooting() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];

  const issues = [
    {
      title: "Wrong Chain ID",
      problem: "Transaction fails with 'invalid chain id' or similar error.",
      solution: `Ensure you're using Chain ID ${config?.chainIdDecimal || 2027} (hex: ${config?.chainIdHex || '0x7EB'}). Check your wallet network settings and code configuration.`,
      code: `// Verify chain ID
const provider = new ethers.JsonRpcProvider("${config?.rpcUrls?.[0]}");
const network = await provider.getNetwork();
console.log("Chain ID:", network.chainId); // Should be ${config?.chainIdDecimal || 2027}`
    },
    {
      title: "RPC Timeout",
      problem: "Requests hang or timeout without response.",
      solution: `Try a different RPC endpoint. We provide 5 endpoints for redundancy. If all fail, the network may be experiencing issues - check status or community channels.`,
      code: `// Test RPC health
const rpcs = ${JSON.stringify(config?.rpcUrls?.slice(0, 3) || [], null, 2)};

for (const rpc of rpcs) {
  try {
    const response = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });
    const data = await response.json();
    console.log(\`\${rpc}: Block \${parseInt(data.result, 16)}\`);
  } catch (e) {
    console.error(\`\${rpc}: Failed\`, e.message);
  }
}`
    },
    {
      title: "Intrinsic Gas Too Low",
      problem: "Transaction rejected with 'intrinsic gas too low' error.",
      solution: `Increase the gas limit. Minimum gas for a simple transfer is 21,000. For contract calls, estimate gas first and add a buffer (e.g., 20% extra).`,
      code: `// Estimate gas properly
const gasEstimate = await provider.estimateGas({
  from: wallet.address,
  to: recipientAddress,
  value: ethers.parseEther("1.0")
});

// Add 20% buffer
const gasLimit = gasEstimate * 120n / 100n;

const tx = await wallet.sendTransaction({
  to: recipientAddress,
  value: ethers.parseEther("1.0"),
  gasLimit
});`
    },
    {
      title: "Replacement Transaction Underpriced",
      problem: "Cannot replace or speed up a pending transaction.",
      solution: `To replace a pending transaction, use the same nonce but increase maxFeePerGas by at least 10%. This is required by EIP-1559.`,
      code: `// Replace pending transaction
const nonce = await provider.getTransactionCount(wallet.address, 'pending');

const originalMaxFee = ethers.parseUnits("30", "gwei");
const newMaxFee = originalMaxFee * 110n / 100n; // 10% increase

const tx = await wallet.sendTransaction({
  to: recipient,
  value: ethers.parseEther("1.0"),
  nonce, // Same nonce as stuck transaction
  maxFeePerGas: newMaxFee,
  maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
});`
    },
    {
      title: "Contract Deployment Fails",
      problem: "Contract deployment transaction reverts or fails.",
      solution: `1. Set Solidity evmVersion to "cancun" for Avalanche Subnet EVM compatibility. 2. Ensure sufficient gas limit (try 3-5M for complex contracts). 3. Check constructor arguments are correct. 4. Verify you have enough ${config?.nativeTokenSymbol || 'EROL'} for gas fees.`,
      code: `// Solidity compiler settings (Hardhat)
{
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",  // Important for Avalanche compatibility
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

// Foundry (foundry.toml)
[profile.default]
evm_version = "cancun"`
    },
    {
      title: "Transaction Stuck Pending",
      problem: "Transaction remains pending for a long time.",
      solution: `1. Check if you have other transactions with lower nonces that are stuck. 2. Verify your gas settings are sufficient (maxFeePerGas > current base fee). 3. Try replacing the transaction with higher gas. 4. Check your balance covers gas costs.`,
      code: `// Check pending transactions and nonces
const pendingNonce = await provider.getTransactionCount(wallet.address, 'pending');
const confirmedNonce = await provider.getTransactionCount(wallet.address, 'latest');

console.log("Confirmed nonce:", confirmedNonce);
console.log("Pending nonce:", pendingNonce);
console.log("Stuck transactions:", pendingNonce - confirmedNonce);

// Get current fee data
const feeData = await provider.getFeeData();
console.log("Current base fee:", ethers.formatUnits(feeData.maxFeePerGas, "gwei"), "gwei");`
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Troubleshooting</h1>
      <p className="text-slate-400 mb-8">Common issues and how to fix them.</p>

      {issues.map((issue, i) => (
        <section key={i} className="mb-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400 font-medium text-sm">
              {i + 1}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2">{issue.title}</h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
                <p className="text-sm text-red-300"><strong>Problem:</strong> {issue.problem}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-300"><strong>Solution:</strong> {issue.solution}</p>
              </div>
              {issue.code && <CodeBlock code={issue.code} />}
            </div>
          </div>
        </section>
      ))}

      <Callout type="tip" title="Still Stuck?">
        Check the block explorer at <a href={config?.explorerUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">{config?.explorerUrl}</a> to see transaction status and error messages. The explorer often provides detailed revert reasons.
      </Callout>
    </div>
  );
}