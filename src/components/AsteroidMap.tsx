import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Asteroid, Card } from '../types/game';
import { MAP_WIDTH, MAP_HEIGHT, VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../utils/gameUtils';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';

export const AsteroidMap: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) {
      // When zooming in, center on selected asteroid or default to center
      if (selectedAsteroid) {
        centerOnAsteroid(selectedAsteroid);
      } else {
        setViewPosition({
          x: (MAP_WIDTH - VIEWPORT_WIDTH) / 2,
          y: (MAP_HEIGHT - VIEWPORT_HEIGHT) / 2
        });
      }
    }
  };

  const centerOnAsteroid = (asteroid: Asteroid) => {
    const newX = Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH,
      asteroid.position.x - VIEWPORT_WIDTH / 2));
    const newY = Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT,
      asteroid.position.y - VIEWPORT_HEIGHT / 2));
    setViewPosition({ x: newX, y: newY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX + viewPosition.x,
      y: e.clientY + viewPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH,
      dragStart.x - e.clientX));
    const newY = Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT,
      dragStart.y - e.clientY));
    
    setViewPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      return () => document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  const getMiningCards = () => {
    return state.hand.filter(card => 
      card.type === 'mining' && 
      (!card.asteroidTypeRequirement || 
        (selectedAsteroid && state.player.equippedMiningTypes.includes(selectedAsteroid.type)))
    );
  };

  const handleAsteroidClick = (asteroid: Asteroid) => {
    setSelectedAsteroid(asteroid);
    setSelectedCard(null);
    if (isZoomed) {
      centerOnAsteroid(asteroid);
    }
  };

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  const handleDeploy = () => {
    if (selectedAsteroid && selectedCard) {
      dispatch({ 
        type: 'PLAY_CARD', 
        card: selectedCard,
        targetAsteroidId: selectedAsteroid.id 
      });
      setSelectedAsteroid(null);
      setSelectedCard(null);
    }
  };

  const getAsteroidStatus = (asteroid: Asteroid) => {
    const operations = state.activeMiningOperations.filter(op => op.asteroidId === asteroid.id);
    return {
      isMined: operations.length > 0,
      operations
    };
  };

  const scale = isZoomed ? 1 : 0.4;
  const asteroidSize = isZoomed ? 64 : 24;

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Asteroid Field</h2>
        <div className="flex gap-2">
          <button
            onClick={handleZoomToggle}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
          {selectedAsteroid && (
            <button
              onClick={() => centerOnAsteroid(selectedAsteroid)}
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              <Search size={20} />
            </button>
          )}
        </div>
      </div>

      <div 
        ref={mapRef}
        className="relative h-[600px] bg-gray-900 rounded-lg overflow-hidden mb-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDragging ? 'grabbing' : isZoomed ? 'grab' : 'default' }}
      >
        <div
          className="absolute transition-transform duration-200"
          style={{
            transform: `scale(${scale}) translate(${-viewPosition.x}px, ${-viewPosition.y}px)`,
            transformOrigin: '0 0',
            width: MAP_WIDTH,
            height: MAP_HEIGHT
          }}
        >
          {state.asteroids.map(asteroid => {
            const status = getAsteroidStatus(asteroid);
            return (
              <div
                key={asteroid.id}
                onClick={() => handleAsteroidClick(asteroid)}
                className={`absolute cursor-pointer transition-transform hover:scale-110 
                  ${selectedAsteroid?.id === asteroid.id ? 'ring-2 ring-blue-500' : ''}
                  ${status.isMined ? 'opacity-50' : ''}`}
                style={{
                  left: `${asteroid.position.x}px`,
                  top: `${asteroid.position.y}px`,
                  width: `${asteroidSize}px`,
                  height: `${asteroidSize}px`,
                  transform: `translate(-${asteroidSize/2}px, -${asteroidSize/2}px)`
                }}
              >
                <div className={`w-full h-full rounded-full flex items-center justify-center
                  ${asteroid.type === 'C' ? 'bg-gray-700' :
                    asteroid.type === 'S' ? 'bg-blue-700' :
                    'bg-purple-700'}`}
                >
                  <div className="text-center">
                    <div className="text-xs font-bold">{asteroid.type}</div>
                    {isZoomed && (
                      <div className="text-xs">{Math.floor((asteroid.health / asteroid.maxHealth) * 100)}%</div>
                    )}
                  </div>
                </div>
                {status.operations.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-4 h-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedAsteroid && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">{selectedAsteroid.name}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p>Type: {selectedAsteroid.type}</p>
              <p>Health: {selectedAsteroid.health}/{selectedAsteroid.maxHealth}</p>
              <p>Difficulty: {selectedAsteroid.difficulty}</p>
            </div>
            <div>
              <p className="font-bold">Resources:</p>
              {Object.entries(selectedAsteroid.resources).map(([resource, amount]) => (
                <p key={resource}>{resource}: {amount}</p>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-bold mb-2">Available Mining Ships:</h4>
            <div className="flex gap-2">
              {getMiningCards().map(card => (
                <button
                  key={card.id}
                  onClick={() => handleCardSelect(card)}
                  className={`px-3 py-1 rounded ${
                    selectedCard?.id === card.id
                      ? 'bg-blue-600'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                >
                  {card.name}
                </button>
              ))}
            </div>
          </div>

          {selectedCard && (
            <button
              onClick={handleDeploy}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
            >
              Deploy Mining Ship
            </button>
          )}
        </div>
      )}
    </div>
  );
};