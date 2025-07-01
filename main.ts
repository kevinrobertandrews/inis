import { runGame } from './src/game.ts';

// Create a dummy game object for now
const dummyGame = {
  phase: 'assembly',
  subPhase: 'check_win_conditions',
  round: 1,
  brennId: null,
  players: { items: [], find: () => null },
  territories: { items: [], find: () => null },
  draftedHands: {},
  discardedCards: { items: [], find: () => null },
  deck: { items: [], find: () => null },
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
