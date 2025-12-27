import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeBlock from '@/components/ui/CodeBlock';
import Callout from '@/components/ui/Callout';
import { ArrowRight } from 'lucide-react';

export default function DocsQuickstart() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];
  const rpcUrl = config?.rpcUrls?.[0] || 'https://rpc1.martianchain.com';

  const curlChainId = `curl -X POST ${rpcUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'`;

  const curlBlockNumber = `curl -X POST ${rpcUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'`;

  const hardhatConfig = `// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    martian: {
      url: "${rpcUrl}",
      chainId: ${config?.chainIdDecimal || 2027},
      accounts: [process.env.PRIVATE_KEY || ""]
    }
  }
};

export default config;`;

  const counterSol = `// contracts/Counter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 public count;

    function increment() public {
        count += 1;
    }

    function decrement() public {
        count -= 1;
    }
}`;

  const deployScript = `// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();
  console.log("Counter deployed to:", await counter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`;

  const hardhatCommands = `# Install dependencies
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Set your private key (never commit this!)
export PRIVATE_KEY="your_private_key_here"

# Compile and deploy
npx hardhat compile
npx hardhat run scripts/deploy.ts --network martian`;

  const foundryToml = `# foundry.toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.24"
evm_version = "cancun"

[rpc_endpoints]
martian = "${rpcUrl}"`;

  const foundryCommands = `# Initialize project
forge init my-martian-project
cd my-martian-project

# Create a simple contract
cat > src/Counter.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 public count;
    function increment() public { count += 1; }
}
EOF

# Deploy (replace with your private key)
forge create --rpc-url ${rpcUrl} \\
  --private-key YOUR_PRIVATE_KEY \\
  src/Counter.sol:Counter`;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Quickstart</h1>
      <p className="text-slate-400 mb-8">Deploy your first contract in 5 minutes.</p>

      {/* Step 1 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center">1</span>
          Add Martian Chain to Your Wallet
        </h2>
        <p className="text-slate-400 mb-4">
          Configure MetaMask or your preferred wallet with Martian Chain.
        </p>
        <Link 
          to={createPageUrl('DocsWallet')}
          className="inline-flex items-center text-orange-400 hover:text-orange-300"
        >
          View wallet setup guide <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </section>

      {/* Step 2 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center">2</span>
          Verify RPC Connection
        </h2>
        <p className="text-slate-400 mb-4">
          Confirm your RPC endpoint is working with a simple JSON-RPC call.
        </p>
        
        <div className="space-y-4">
          <CodeBlock code={curlChainId} title="Check Chain ID" />
          <CodeBlock code={curlBlockNumber} title="Check Latest Block" />
        </div>

        <Callout type="tip" title="Expected Response">
          Chain ID should return <code className="text-orange-400">{config?.chainIdHex || '0x7EB'}</code> (2027 in decimal).
        </Callout>
      </section>

      {/* Step 3 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center">3</span>
          Deploy a Contract
        </h2>
        <p className="text-slate-400 mb-4">
          Choose your preferred development framework.
        </p>

        <Tabs defaultValue="hardhat" className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="hardhat" className="data-[state=active]:bg-slate-700">Hardhat</TabsTrigger>
            <TabsTrigger value="foundry" className="data-[state=active]:bg-slate-700">Foundry</TabsTrigger>
          </TabsList>

          <TabsContent value="hardhat" className="space-y-4 mt-4">
            <CodeBlock code={hardhatCommands} title="Terminal Commands" />
            <CodeBlock code={hardhatConfig} title="hardhat.config.ts" />
            <CodeBlock code={counterSol} title="contracts/Counter.sol" />
            <CodeBlock code={deployScript} title="scripts/deploy.ts" />
          </TabsContent>

          <TabsContent value="foundry" className="space-y-4 mt-4">
            <CodeBlock code={foundryToml} title="foundry.toml" />
            <CodeBlock code={foundryCommands} title="Terminal Commands" />
          </TabsContent>
        </Tabs>

        <Callout type="note" title="Contract Verification">
          After deployment, verify your contract through the explorer UI at{' '}
          <a href={config?.explorerUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
            {config?.explorerUrl}
          </a>. Follow the explorer's verification instructions.
        </Callout>

        <Callout type="warning" title="EVM Version">
          Set Solidity <code>evmVersion</code> to <code>"cancun"</code> for best compatibility with Avalanche Subnet EVM.
        </Callout>
      </section>

      {/* Next Steps */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Next Steps</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link 
            to={createPageUrl('DocsRecipeRead')}
            className="p-4 rounded-lg border border-slate-700 hover:border-orange-500/50 transition-colors"
          >
            <h4 className="text-white font-medium mb-1">Read Data with viem</h4>
            <p className="text-slate-400 text-sm">Query blockchain state</p>
          </Link>
          <Link 
            to={createPageUrl('DocsRecipeSend')}
            className="p-4 rounded-lg border border-slate-700 hover:border-orange-500/50 transition-colors"
          >
            <h4 className="text-white font-medium mb-1">Send Transactions</h4>
            <p className="text-slate-400 text-sm">Transfer tokens with ethers.js</p>
          </Link>
        </div>
      </section>
    </div>
  );
}