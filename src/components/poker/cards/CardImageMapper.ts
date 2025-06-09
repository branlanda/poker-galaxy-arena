
// Card image mapping system for real card images
export interface CardImageMap {
  [key: string]: string;
}

// Map card codes to their image URLs
export const cardImageMap: CardImageMap = {
  // Hearts (Corazones)
  'AH': '/lovable-uploads/as_corazones.png',
  '2H': '/lovable-uploads/2_corazones.png',
  '3H': '/lovable-uploads/3_corazones.png',
  '4H': '/lovable-uploads/4_corazones.png',
  '5H': '/lovable-uploads/5_corazones.png',
  '6H': '/lovable-uploads/6_corazones.png',
  '7H': '/lovable-uploads/7_corazones.png',
  '8H': '/lovable-uploads/8_corazones.png',
  '9H': '/lovable-uploads/9_corazones.png',
  '10H': '/lovable-uploads/10_corazones.png',
  'JH': '/lovable-uploads/j_corazones.png',
  'QH': '/lovable-uploads/q_corazones.png',
  'KH': '/lovable-uploads/k_corazones.png',

  // Diamonds (Diamantes)
  'AD': '/lovable-uploads/as_diamantes.png',
  '2D': '/lovable-uploads/2_diamantes.png',
  '3D': '/lovable-uploads/3_diamantes.png',
  '4D': '/lovable-uploads/4_diamantes.png',
  '5D': '/lovable-uploads/5_diamantes.png',
  '6D': '/lovable-uploads/6_diamantes.png',
  '7D': '/lovable-uploads/7_diamantes.png',
  '8D': '/lovable-uploads/8_diamantes.png',
  '9D': '/lovable-uploads/9_diamantes.png',
  '10D': '/lovable-uploads/10_diamantes.png',
  'JD': '/lovable-uploads/j_diamantes.png',
  'QD': '/lovable-uploads/q_diamantes.png',
  'KD': '/lovable-uploads/k_diamantes.png',

  // Spades (Picas)
  'AS': '/lovable-uploads/as_picas.png',
  '2S': '/lovable-uploads/2_picas.png',
  '3S': '/lovable-uploads/3_picas.png',
  '4S': '/lovable-uploads/4_picas.png',
  '5S': '/lovable-uploads/5_picas.png',
  '6S': '/lovable-uploads/6_picas.png',
  '7S': '/lovable-uploads/7_picas.png',
  '8S': '/lovable-uploads/8_picas.png',
  '9S': '/lovable-uploads/9_picas.png',
  '10S': '/lovable-uploads/10_picas.png',
  'JS': '/lovable-uploads/j_picas.png',
  'QS': '/lovable-uploads/q_picas.png',
  'KS': '/lovable-uploads/k_picas.png',

  // Clubs (Tréboles)
  'AC': '/lovable-uploads/as_treboles.png',
  '2C': '/lovable-uploads/2_treboles.png',
  '3C': '/lovable-uploads/3_treboles.png',
  '4C': '/lovable-uploads/4_treboles.png',
  '5C': '/lovable-uploads/5_treboles.png',
  '6C': '/lovable-uploads/6_treboles.png',
  '7C': '/lovable-uploads/7_treboles.png',
  '8C': '/lovable-uploads/8_treboles.png',
  '9C': '/lovable-uploads/9_treboles.png',
  '10C': '/lovable-uploads/10_treboles.png',
  'JC': '/lovable-uploads/j_treboles.png',
  'QC': '/lovable-uploads/q_treboles.png',
  'KC': '/lovable-uploads/k_treboles.png'
};

// Card back image (Poker Galaxy design)
export const CARD_BACK_IMAGE = '/lovable-uploads/0d3819b2-3986-4dc7-95d6-60fb6b270ab8.png';

// Helper function to get card code from suit and value
export const getCardCode = (suit: string, value: string): string => {
  const suitMap: { [key: string]: string } = {
    'hearts': 'H',
    'diamonds': 'D',
    'spades': 'S',
    'clubs': 'C'
  };
  
  const valueMap: { [key: string]: string } = {
    'A': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10',
    'J': 'J',
    'Q': 'Q',
    'K': 'K'
  };

  return `${valueMap[value] || value}${suitMap[suit] || suit.charAt(0).toUpperCase()}`;
};

// Get image URL for a card
export const getCardImageUrl = (suit: string, value: string): string => {
  const cardCode = getCardCode(suit, value);
  return cardImageMap[cardCode] || '';
};

// Check if a card image exists
export const hasCardImage = (suit: string, value: string): boolean => {
  const cardCode = getCardCode(suit, value);
  return cardCode in cardImageMap;
};
