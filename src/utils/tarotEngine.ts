// Seeded random for better shuffle
let seed = Date.now();

function seededRandom(): number {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

// Shuffle array using Fisher-Yates algorithm with better randomness
export function shuffle<T>(array: T[]): T[] {
  // Update seed each shuffle for true randomness
  seed = Date.now() + Math.random() * 10000;
  
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Draw n cards from the deck - truly random each time
export function drawCards<T>(deck: T[], count: number): T[] {
  // Create a copy and shuffle it fresh each time
  const deckCopy = [...deck];
  const shuffled = shuffle(deckCopy);
  return shuffled.slice(0, count);
}

// Extract themes from card names
export function extractThemesFromCards(cards: string[]): string[] {
  const themes: string[] = [];
  const themeMap: Record<string, string[]> = {
    'The Fool': ['new beginnings', 'innocence', 'spontaneity'],
    'The Magician': ['manifestation', 'resourcefulness', 'power'],
    'The High Priestess': ['intuition', 'unconscious', 'mystery'],
    'The Empress': ['fertility', 'nurturing', 'abundance'],
    'The Emperor': ['authority', 'structure', 'control'],
    'The Hierophant': ['tradition', 'conformity', 'morality'],
    'The Lovers': ['love', 'harmony', 'choices'],
    'The Chariot': ['control', 'willpower', 'victory'],
    'Strength': ['courage', 'persuasion', 'influence'],
    'The Hermit': ['introspection', 'solitude', 'guidance'],
    'Wheel of Fortune': ['luck', 'karma', 'cycles'],
    'Justice': ['fairness', 'truth', 'law'],
    'The Hanged Man': ['sacrifice', 'release', 'martyrdom'],
    'Death': ['transformation', 'endings', 'change'],
    'Temperance': ['balance', 'moderation', 'patience'],
    'The Devil': ['shadow self', 'attachment', 'restriction'],
    'The Tower': ['sudden change', 'upheaval', 'awakening'],
    'The Star': ['hope', 'faith', 'purpose'],
    'The Moon': ['illusion', 'fear', 'anxiety'],
    'The Sun': ['positivity', 'fun', 'warmth'],
    'Judgement': ['rebirth', 'inner calling', 'absolution'],
    'The World': ['completion', 'integration', 'accomplishment'],
  };
  
  cards.forEach(card => {
    const cardThemes = themeMap[card];
    if (cardThemes) {
      themes.push(...cardThemes);
    }
  });
  
  return [...new Set(themes)]; // Remove duplicates
}

// Extract archetypes from card names
export function extractArchetypesFromCards(cards: string[]): string[] {
  const archetypes: string[] = [];
  const archetypeMap: Record<string, string> = {
    'The Fool': 'The Seeker',
    'The Magician': 'The Manifestor',
    'The High Priestess': 'The Mystic',
    'The Empress': 'The Nurturer',
    'The Emperor': 'The Ruler',
    'The Hierophant': 'The Teacher',
    'The Lovers': 'The Lover',
    'The Chariot': 'The Warrior',
    'Strength': 'The Courageous',
    'The Hermit': 'The Sage',
    'Wheel of Fortune': 'The Gambler',
    'Justice': 'The Judge',
    'The Hanged Man': 'The Martyr',
    'Death': 'The Transformer',
    'Temperance': 'The Alchemist',
    'The Devil': 'The Shadow',
    'The Tower': 'The Disruptor',
    'The Star': 'The Dreamer',
    'The Moon': 'The Illusionist',
    'The Sun': 'The Radiant',
    'Judgement': 'The Redeemer',
    'The World': 'The Completer',
  };
  
  cards.forEach(card => {
    const archetype = archetypeMap[card];
    if (archetype && !archetypes.includes(archetype)) {
      archetypes.push(archetype);
    }
  });
  
  return archetypes;
}

// Build narrative from cards
export function buildNarrative(cards: string[]): string {
  if (cards.length === 0) return '';
  if (cards.length === 1) return `The ${cards[0]} sets the tone for this reading.`;
  
  return cards.map((card, i) => {
    if (i === 0) return `Opening with ${card}`;
    if (i === cards.length - 1) return `culminating in ${card}`;
    return `moving through ${card}`;
  }).join(', ') + '.';
}
