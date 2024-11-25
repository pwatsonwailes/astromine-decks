import React from 'react';
import { Rocket, Gem } from 'lucide-react';

interface WelcomeScreenProps {
  onStartGame: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <Rocket size={48} className="text-blue-500" />
            <Gem size={48} className="text-purple-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">Astromine</h1>
          <p className="text-xl text-gray-300">
            Build your mining empire among the stars
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg text-left space-y-4">
          <h2 className="text-xl font-bold text-white">Your Mission</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Command mining ships and harvest valuable resources</li>
            <li>• Upgrade your fleet with advanced equipment</li>
            <li>• Manage your corporation's growth and expansion</li>
            <li>• Compete for the most valuable asteroid deposits</li>
          </ul>
        </div>

        <button
          onClick={onStartGame}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
        >
          Start New Game
        </button>
      </div>
    </div>
  );
};