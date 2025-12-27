import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import CodeBlock from '@/components/ui/CodeBlock';
import Callout from '@/components/ui/Callout';

export default function DocsRecipeEvents() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];
  const wsUrl = config?.wsUrls?.[0] || 'wss://rpc-ws1.martianchain.com';

  const subscribeBlocks = `import { createPublicClient, webSocket } from "viem";
import { defineChain } from "viem";

const martianChain = defineChain({
  id: ${config?.chainIdDecimal || 2027},
  name: "${config?.chainName || 'Martian Chain'}",
  rpcUrls: {
    default: { webSocket: ["${wsUrl}"] }
  }
});

const client = createPublicClient({
  chain: martianChain,
  transport: webSocket()
});

// Subscribe to new blocks
const unwatch = client.watchBlocks({
  onBlock: (block) => {
    console.log("New block:", block.number, block.hash);
  }
});

// Unsubscribe when done
// unwatch();`;

  const subscribePendingTx = `// Subscribe to pending transactions
const unwatch = client.watchPendingTransactions({
  onTransactions: (hashes) => {
    console.log("Pending transactions:", hashes);
  }
});`;

  const subscribeContractEvents = `import { parseAbi } from "viem";

const abi = parseAbi([
  "event Transfer(address indexed from, address indexed to, uint256 value)"
]);

// Subscribe to contract events
const unwatch = client.watchContractEvent({
  address: "0xYOUR_TOKEN_CONTRACT",
  abi,
  eventName: "Transfer",
  onLogs: (logs) => {
    logs.forEach(log => {
      console.log("Transfer event:", {
        from: log.args.from,
        to: log.args.to,
        value: log.args.value
      });
    });
  }
});`;

  const rawWebSocket = `// Raw WebSocket subscription
const ws = new WebSocket("${wsUrl}");

ws.onopen = () => {
  // Subscribe to new block headers
  ws.send(JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_subscribe",
    params: ["newHeads"],
    id: 1
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.method === "eth_subscription") {
    console.log("New block:", data.params.result.number);
  }
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = () => {
  console.log("WebSocket closed");
};`;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Subscribe to Events</h1>
      <p className="text-slate-400 mb-8">Real-time blockchain data via WebSocket.</p>

      {/* Block Subscriptions */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Subscribe to New Blocks</h2>
        <p className="text-slate-400 mb-4">
          Get notified immediately when new blocks are mined.
        </p>
        <CodeBlock code={subscribeBlocks} title="watchBlocks.ts" />
      </section>

      {/* Pending Transactions */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Pending Transactions</h2>
        <p className="text-slate-400 mb-4">
          Monitor the mempool for pending transactions.
        </p>
        <CodeBlock code={subscribePendingTx} title="watchPendingTx.ts" />
      </section>

      {/* Contract Events */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Contract Events</h2>
        <p className="text-slate-400 mb-4">
          Listen for specific events emitted by smart contracts.
        </p>
        <CodeBlock code={subscribeContractEvents} title="watchEvents.ts" />
      </section>

      {/* Raw WebSocket */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Raw WebSocket</h2>
        <p className="text-slate-400 mb-4">
          Use native WebSocket API for lower-level control.
        </p>
        <CodeBlock code={rawWebSocket} title="rawWebSocket.js" />
      </section>

      <Callout type="tip" title="Connection Management">
        Always unsubscribe or close WebSocket connections when your component unmounts or when you're done listening to prevent memory leaks.
      </Callout>

      <Callout type="note" title="Available Subscriptions">
        Martian Chain supports: <code>newHeads</code> (new blocks), <code>logs</code> (contract events), and <code>newPendingTransactions</code> (mempool).
      </Callout>
    </div>
  );
}