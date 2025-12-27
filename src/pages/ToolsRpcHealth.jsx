import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ToolsRpcHealth() {
  const { data: configs } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];
  const [rpcStatuses, setRpcStatuses] = useState([]);
  const [wsStatuses, setWsStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const checkRpcHealth = async () => {
    if (!config?.rpcUrls) return;
    
    setLoading(true);
    const results = await Promise.all(
      config.rpcUrls.map(async (url, index) => {
        const start = Date.now();
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_blockNumber',
              params: [],
              id: 1
            }),
            signal: AbortSignal.timeout(5000)
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const text = await response.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            throw new Error('Invalid JSON response');
          }
          
          const latency = Date.now() - start;
          const blockNumber = data.result ? parseInt(data.result, 16) : null;
          
          return {
            url,
            status: 'online',
            latency,
            blockNumber
          };
        } catch (error) {
          return {
            url,
            status: 'offline',
            latency: Date.now() - start,
            error: error.message
          };
        }
      })
    );
    setRpcStatuses(results);
    setLoading(false);
  };

  const checkWsHealth = async () => {
    if (!config?.wsUrls) return;
    
    const results = await Promise.all(
      config.wsUrls.map(async (url) => {
        return new Promise((resolve) => {
          const start = Date.now();
          const ws = new WebSocket(url);
          
          const timeout = setTimeout(() => {
            ws.close();
            resolve({
              url,
              status: 'timeout',
              latency: Date.now() - start
            });
          }, 5000);
          
          ws.onopen = () => {
            clearTimeout(timeout);
            ws.close();
            resolve({
              url,
              status: 'connected',
              latency: Date.now() - start
            });
          };
          
          ws.onerror = () => {
            clearTimeout(timeout);
            resolve({
              url,
              status: 'failed',
              latency: Date.now() - start
            });
          };
        });
      })
    );
    setWsStatuses(results);
  };

  const checkAll = async () => {
    await Promise.all([checkRpcHealth(), checkWsHealth()]);
  };

  useEffect(() => {
    if (config) {
      checkAll();
    }
  }, [config]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(checkAll, 60000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, config]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'timeout':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-red-400 bg-red-500/10 border-red-500/30';
    }
  };

  const getLatencyColor = (latency) => {
    if (latency < 100) return 'text-green-400';
    if (latency < 300) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
        return <CheckCircle className="h-5 w-5" />;
      case 'timeout':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <XCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">RPC Health Checker</h1>
            <p className="text-slate-400">Monitor endpoint status and performance.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(
                "border-slate-700",
                autoRefresh && "bg-orange-500/10 border-orange-500/30 text-orange-400"
              )}
            >
              <Zap className="h-4 w-4 mr-2" />
              {autoRefresh ? 'Auto On' : 'Auto Off'}
            </Button>
            <Button
              onClick={checkAll}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              {loading ? 'Checking...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* RPC Endpoints */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">HTTPS RPC Endpoints</h2>
          <div className="space-y-3">
            {rpcStatuses.map((rpc, i) => (
              <div
                key={i}
                className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={cn("rounded-lg p-2 border", getStatusColor(rpc.status))}>
                    {getStatusIcon(rpc.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-white truncate">{rpc.url}</p>
                    {rpc.error && (
                      <p className="text-xs text-red-400 mt-1">{rpc.error}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  {rpc.blockNumber && (
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">Block</p>
                      <p className="text-white font-mono">{rpc.blockNumber.toLocaleString()}</p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Latency</p>
                    <p className={cn("font-mono", getLatencyColor(rpc.latency))}>
                      {rpc.latency}ms
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WebSocket Endpoints */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">WebSocket Endpoints</h2>
          <div className="space-y-3">
            {wsStatuses.map((ws, i) => (
              <div
                key={i}
                className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={cn("rounded-lg p-2 border", getStatusColor(ws.status))}>
                    {getStatusIcon(ws.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-white truncate">{ws.url}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs">Connection</p>
                  <p className={cn("font-mono text-sm", getLatencyColor(ws.latency))}>
                    {ws.latency}ms
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {autoRefresh && (
          <p className="text-center text-sm text-slate-500 mt-8">
            Auto-refresh enabled. Checking every 60 seconds.
          </p>
        )}
      </div>
    </div>
  );
}