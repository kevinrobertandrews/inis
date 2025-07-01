import { runGame } from './src/game.ts';
import {
  Collection,
  Card,
  Player,
  Color,
  Game,
  Keyword,
} from './src/models.ts';

// Create a dummy game object for now
const dummyGame = {
  phase: 'assembly',
  subPhase: 'check_win_conditions',
  round: 1,
  brennId: null,
  players: createDummyPlayers(),
  territories: { items: [], find: () => null },
  draftedHands: {},
  discardedCards: { items: [], find: () => null },
  deck: generateSampleDeck(),
  epicTales: { items: [], find: () => null },
  deeds: { items: [], find: () => null },
  victoryClaims: { items: [], find: () => null },
  pendingChallenges: { items: [], find: () => null },
  map: {
    explored: { items: [], find: () => null },
    unexplored: { items: [], find: () => null },
  },
  log: { items: [], find: () => null },
};

console.log('Starting game loop...');
runGame(dummyGame as any);

// helpers

function generateSampleDeck(): Collection<Card> {
  const sampleCards: Card[] = Array.from({ length: 12 }, (_, i) => ({
    id: `card${i + 1}`,
    name: `Card ${i + 1}`,
    type: 'action',
    description: `Effect of card ${i + 1}`,
    effect: (game, playerId) => {
      console.log(`Card ${i + 1} played by Player ${playerId}`);
    },
  }));

  return {
    items: sampleCards,
    find: (id) => sampleCards.find((c) => c.id === id) || null,
  };
}

function createDummyPlayers(): Collection<Player> {
  console.log('creating dummy players...');
  const colors = [Color.White, Color.Orange, Color.Green];
  const players: Player[] = colors.map((color, i) => ({
    id: i.toString(),
    name: `Player ${i + 1}`,
    color,
    clans: { items: [], find: () => null },
    hand: { items: [], find: () => null },
    epicTales: [],
    deeds: { items: [], find: () => null },
    passed: false,
  }));

  return {
    items: players,
    find: (id) => players.find((p) => p.id === id) || null,
  };
}

// TODO save for later when implementing logs
function logPhase(game: Game, keyword: Keyword, message: string) {
  game.log.items.push({
    round: game.round,
    phase: keyword,
    description: message,
    timestamp: new Date(),
  });
}
