import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const typeColors = {
  feature: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  fix: 'bg-green-500/10 text-green-400 border-green-500/30',
  breaking: 'bg-red-500/10 text-red-400 border-red-500/30',
  improvement: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  security: 'bg-orange-500/10 text-orange-400 border-orange-500/30'
};

export default function DocsChangelog() {
  const { data: entries, isLoading } = useQuery({
    queryKey: ['changelog'],
    queryFn: () => base44.entities.ChangelogEntry.list('-created_date'),
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Changelog</h1>
      <p className="text-slate-400 mb-8">Network updates and documentation changes.</p>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 animate-pulse">
              <div className="h-6 w-32 bg-slate-700 rounded mb-3" />
              <div className="h-4 w-full bg-slate-700 rounded mb-2" />
              <div className="h-4 w-3/4 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-6">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">{entry.title}</h2>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium border",
                    typeColors[entry.type]
                  )}>
                    {entry.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(entry.created_date), 'MMM d, yyyy')}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <Tag className="h-3 w-3" />
                {entry.version}
              </div>
              <p className="text-slate-300 whitespace-pre-wrap">{entry.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Updates Yet</h3>
            <p className="text-slate-400 text-sm">
              Network and documentation updates will appear here as they're published.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}