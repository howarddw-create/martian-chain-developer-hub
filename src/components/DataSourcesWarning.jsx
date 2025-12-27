import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * DATA SOURCES & PLACEHOLDER INFORMATION
 * 
 * ⚠️ IMPORTANT: All network data in this portal is PLACEHOLDER/EXAMPLE DATA
 * 
 * FAKE/Placeholder Data:
 * - RPC URLs: https://rpc1.martianchain.com, https://rpc2.martianchain.com
 * - WebSocket URLs: wss://ws1.martianchain.com, wss://ws2.martianchain.com
 * - Chain ID: 1681717 (0x19A4C5)
 * - All contract addresses (0x111..., 0x222...)
 * - Owner addresses (C-Chain and P-Chain)
 * - Subnet ID, Blockchain ID, Conversion TX ID
 * - Explorer, website, docs URLs
 * - Network parameters (block time, gas limit, base fee)
 * - Token symbol, name, and total supply
 * 
 * REAL Data:
 * - UI/UX design and components
 * - Code examples for ethers.js and viem
 * - Documentation structure and guides
 * - React architecture
 * 
 * BEFORE PRODUCTION:
 * 1. Replace all fake values with real Martian Chain data
 * 2. Update NetworkConfig entity through Base44 dashboard
 * 3. Test all RPC endpoints
 * 4. Verify contract addresses on explorer
 * 5. Remove this warning component
 */

export default function DataSourcesWarning() {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-400 font-semibold mb-1">⚠️ Placeholder Data Warning</h3>
          <p className="text-red-300 text-sm">
            This portal currently contains FAKE example data for demonstration purposes. 
            All RPC URLs, contract addresses, and network identifiers are placeholders and must be 
            replaced with real Martian Chain values before production deployment.
          </p>
        </div>
      </div>
    </div>
  );
}