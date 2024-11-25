import React from 'react';
import { Resource } from '../types/game';

interface ResourcePanelProps {
  resources: Record<Resource, number>;
}

export const ResourcePanel: React.FC<ResourcePanelProps> = ({ resources }) => {
  const resourceColors: Record<Resource, string> = {
    iron: 'bg-gray-600',
    titanium: 'bg-blue-600',
    platinum: 'bg-yellow-600',
    water: 'bg-cyan-600',
    helium3: 'bg-purple-600'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Resources</h2>
      <div className="space-y-3">
        {(Object.entries(resources) as [Resource, number][]).map(([resource, amount]) => (
          <div key={resource} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${resourceColors[resource]}`} />
            <span className="capitalize">{resource}</span>
            <span className="ml-auto">{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};