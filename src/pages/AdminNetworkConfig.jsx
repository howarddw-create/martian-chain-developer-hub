import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Callout from '@/components/ui/Callout';

export default function AdminNetworkConfig() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) return await base44.auth.me();
      return null;
    }
  });

  const { data: configs, isLoading: configLoading } = useQuery({
    queryKey: ['networkConfig'],
    queryFn: () => base44.entities.NetworkConfig.list(),
  });

  const config = configs?.[0];

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  useEffect(() => {
    if (!userLoading && (!user || user.role !== 'admin')) {
      navigate(createPageUrl('Home'));
    }
  }, [user, userLoading, navigate]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const oldConfig = { ...config };
      await base44.entities.NetworkConfig.update(config.id, data);
      
      // Log changes
      const changes = [];
      Object.keys(data).forEach(key => {
        if (JSON.stringify(oldConfig[key]) !== JSON.stringify(data[key])) {
          changes.push({
            adminEmail: user.email,
            fieldChanged: key,
            oldValue: JSON.stringify(oldConfig[key]),
            newValue: JSON.stringify(data[key]),
            changeDescription: `Updated ${key}`
          });
        }
      });
      
      if (changes.length > 0) {
        await base44.entities.NetworkConfigChangeLog.bulkCreate(changes);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkConfig'] });
      navigate(createPageUrl('ToolsNetworkRegistry'));
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    updateMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    const arr = value.split('\n').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arr }));
  };

  if (userLoading || configLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl('ToolsNetworkRegistry'))}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Registry
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Network Configuration</h1>
          <p className="text-slate-400">Update Martian Chain network constants. Changes are logged.</p>
        </div>

        {error && (
          <Callout type="danger" title="Error">
            {error}
          </Callout>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Chain Info */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Chain Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chainName">Chain Name</Label>
                <Input
                  id="chainName"
                  value={formData.chainName || ''}
                  onChange={(e) => handleChange('chainName', e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="chainIdDecimal">Chain ID (Decimal)</Label>
                <Input
                  id="chainIdDecimal"
                  type="number"
                  value={formData.chainIdDecimal || ''}
                  onChange={(e) => handleChange('chainIdDecimal', parseInt(e.target.value))}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="chainIdHex">Chain ID (Hex)</Label>
                <Input
                  id="chainIdHex"
                  value={formData.chainIdHex || ''}
                  onChange={(e) => handleChange('chainIdHex', e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="blockTimeSeconds">Block Time (seconds)</Label>
                <Input
                  id="blockTimeSeconds"
                  type="number"
                  value={formData.blockTimeSeconds || ''}
                  onChange={(e) => handleChange('blockTimeSeconds', parseInt(e.target.value))}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="gasLimit">Gas Limit</Label>
                <Input
                  id="gasLimit"
                  type="number"
                  value={formData.gasLimit || ''}
                  onChange={(e) => handleChange('gasLimit', parseInt(e.target.value))}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="baseFeeGwei">Base Fee (gwei)</Label>
                <Input
                  id="baseFeeGwei"
                  type="number"
                  value={formData.baseFeeGwei || ''}
                  onChange={(e) => handleChange('baseFeeGwei', parseInt(e.target.value))}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
          </section>

          {/* Native Token */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Native Token</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nativeTokenName">Token Name</Label>
                <Input
                  id="nativeTokenName"
                  value={formData.nativeTokenName || ''}
                  onChange={(e) => handleChange('nativeTokenName', e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="nativeTokenSymbol">Token Symbol</Label>
                <Input
                  id="nativeTokenSymbol"
                  value={formData.nativeTokenSymbol || ''}
                  onChange={(e) => handleChange('nativeTokenSymbol', e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="nativeTokenTotalSupply">Total Supply</Label>
                <Input
                  id="nativeTokenTotalSupply"
                  value={formData.nativeTokenTotalSupply || ''}
                  onChange={(e) => handleChange('nativeTokenTotalSupply', e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
          </section>

          {/* RPC & WS URLs */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Endpoints</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rpcUrls">RPC URLs (one per line)</Label>
                <Textarea
                  id="rpcUrls"
                  value={formData.rpcUrls?.join('\n') || ''}
                  onChange={(e) => handleArrayChange('rpcUrls', e.target.value)}
                  className="bg-slate-800 border-slate-700 h-32 font-mono text-sm"
                />
              </div>
              <div>
                <Label htmlFor="wsUrls">WebSocket URLs (one per line)</Label>
                <Textarea
                  id="wsUrls"
                  value={formData.wsUrls?.join('\n') || ''}
                  onChange={(e) => handleArrayChange('wsUrls', e.target.value)}
                  className="bg-slate-800 border-slate-700 h-32 font-mono text-sm"
                />
              </div>
            </div>
          </section>

          {/* System Contracts */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">System Contracts</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="validatorMessagesLibraryAddress">Validator Messages Library</Label>
                <Input
                  id="validatorMessagesLibraryAddress"
                  value={formData.validatorMessagesLibraryAddress || ''}
                  onChange={(e) => handleChange('validatorMessagesLibraryAddress', e.target.value)}
                  className="bg-slate-800 border-slate-700 font-mono"
                />
              </div>
              <div>
                <Label htmlFor="validatorManagerContractAddress">Validator Manager Contract</Label>
                <Input
                  id="validatorManagerContractAddress"
                  value={formData.validatorManagerContractAddress || ''}
                  onChange={(e) => handleChange('validatorManagerContractAddress', e.target.value)}
                  className="bg-slate-800 border-slate-700 font-mono"
                />
              </div>
            </div>
          </section>

          {/* URLs */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Links</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="explorerUrl">Explorer URL</Label>
                <Input
                  id="explorerUrl"
                  value={formData.explorerUrl || ''}
                  onChange={(e) => handleChange('explorerUrl', e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  value={formData.websiteUrl || ''}
                  onChange={(e) => handleChange('websiteUrl', e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="docsUrl">Docs URL</Label>
                <Input
                  id="docsUrl"
                  value={formData.docsUrl || ''}
                  onChange={(e) => handleChange('docsUrl', e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl('ToolsNetworkRegistry'))}
              className="border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}