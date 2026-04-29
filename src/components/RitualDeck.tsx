import { useState, useEffect, useCallback } from 'react';
import { Card, SelectedCard } from '../types';
import { shuffle } from '../utils/tarotEngine';

// Major Arcana cards for web version
const MAJOR_ARCANA: Card[] = [
  { id: '0', name: 'The Fool', arcana: 'major', number: 0 },
  { id: '1', name: 'The Magician', arcana: 'major', number: 1 },
  { id: '2', name: 'The High Priestess', arcana: 'major', number: 2 },
  { id: '3', name: 'The Empress', arcana: 'major', number: 3 },
  { id: '4', name: 'The Emperor', arcana: 'major', number: 4 },
  { id: '5', name: 'The Hierophant', arcana: 'major', number: 5 },
  { id: '6', name: 'The Lovers', arcana: 'major', number: 6 },
  { id: '7', name: 'The Chariot', arcana: 'major', number: 7 },
  { id: '8', name: 'Strength', arcana: 'major', number: 8 },
  { id: '9', name: 'The Hermit', arcana: 'major', number: 9 },
  { id: '10', name: 'Wheel of Fortune', arcana: 'major', number: 10 },
  { id: '11', name: 'Justice', arcana: 'major', number: 11 },
  { id: '12', name: 'The Hanged Man', arcana: 'major', number: 12 },
  { id: '13', name: 'Death', arcana: 'major', number: 13 },
  { id: '14', name: 'Temperance', arcana: 'major', number: 14 },
  { id: '15', name: 'The Devil', arcana: 'major', number: 15 },
  { id: '16', name: 'The Tower', arcana: 'major', number: 16 },
  { id: '17', name: 'The Star', arcana: 'major', number: 17 },
  { id: '18', name: 'The Moon', arcana: 'major', number: 18 },
  { id: '19', name: 'The Sun', arcana: 'major', number: 19 },
  { id: '20', name: 'Judgement', arcana: 'major', number: 20 },
  { id: '21', name: 'The World', arcana: 'major', number: 21 },
];

interface RitualPosition {
  title: string;
  reason: string;
}

interface RitualDeckProps {
  positions: RitualPosition[];
  onComplete: (cards: SelectedCard[]) => void;
  deckType?: 'digital' | 'physical';
}

export default function RitualDeck({ positions, onComplete, deckType = 'digital' }: RitualDeckProps) {
  const [phase, setPhase] = useState<'shuffling' | 'selecting' | 'revealing'>('shuffling');
  const [deck, setDeck] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    // Initialize and shuffle deck
    const shuffled = shuffle([...MAJOR_ARCANA]);
    setDeck(shuffled);
    
    // Auto-transition to selecting after shuffle animation
    const timer = setTimeout(() => {
      setPhase('selecting');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (phase !== 'selecting') return;
    if (selectedCards.length >= positions.length) return;
    
    const card = deck[index];
    const position = positions[selectedCards.length];
    
    const newSelected: SelectedCard = {
      card,
      position: selectedCards.length,
      positionTitle: position.title,
      reversed: Math.random() > 0.85, // 15% chance of reversed
    };
    
    const updated = [...selectedCards, newSelected];
    setSelectedCards(updated);
    
    if (updated.length === positions.length) {
      setPhase('revealing');
      setTimeout(() => {
        onComplete(updated);
      }, 1000);
    }
  }, [deck, phase, positions, selectedCards, onComplete]);

  if (phase === 'shuffling') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative w-32 h-48">
          <div className="absolute inset-0 bg-ora-teal rounded-lg animate-pulse" />
          <div className="absolute inset-0 bg-ora-gold rounded-lg animate-ping opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
            Shuffling...
          </div>
        </div>
        <p className="mt-8 text-gray-600">Preparing your cards</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="text-center">
        <p className="text-lg font-medium text-ora-teal">
          Select {positions.length} cards
        </p>
        <p className="text-sm text-gray-500">
          {selectedCards.length} of {positions.length} selected
        </p>
      </div>

      {/* Selected cards display */}
      {selectedCards.length > 0 && (
        <div className="flex justify-center gap-4 flex-wrap">
          {selectedCards.map((selected, i) => (
            <div
              key={i}
              className={`w-24 h-36 rounded-lg flex flex-col items-center justify-center p-2 text-center text-xs
                ${selected.reversed ? 'bg-ora-terracotta/20' : 'bg-ora-gold/20'}
                border-2 ${selected.reversed ? 'border-ora-terracotta' : 'border-ora-gold'}
              `}
            >
              <span className="font-medium text-ora-teal">{selected.card.name}</span>
              {selected.reversed && (
                <span className="text-ora-terracotta text-xs mt-1">Reversed</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Current position */}
      {selectedCards.length < positions.length && (
        <div className="text-center bg-ora-ivory p-4 rounded-lg">
          <p className="font-medium text-ora-teal">{positions[selectedCards.length].title}</p>
          <p className="text-sm text-gray-600">{positions[selectedCards.length].reason}</p>
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-7 md:grid-cols-11 gap-2">
        {deck.map((card, index) => {
          const isSelected = selectedCards.some(s => s.card.id === card.id);
          const isHovered = hoveredCard === index;
          
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              disabled={isSelected || phase !== 'selecting'}
              className={`
                aspect-[2/3] rounded-lg transition-all duration-300
                ${isSelected 
                  ? 'bg-gray-200 opacity-30 cursor-not-allowed' 
                  : 'bg-ora-teal hover:bg-ora-gold cursor-pointer hover:scale-105 hover:-translate-y-2'
                }
                ${isHovered && !isSelected ? 'shadow-lg ring-2 ring-ora-gold' : 'shadow'}
              `}
              style={{
                transform: isHovered && !isSelected ? 'translateY(-8px) rotate(-2deg)' : undefined,
              }}
            >
              <div className="w-full h-full flex items-center justify-center p-1">
                <span className="text-xs font-medium text-white text-center leading-tight">
                  {card.number}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-gray-500">
        Click on a card to select it for the current position
      </p>
    </div>
  );
}
