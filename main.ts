import { runGame } from './src/game.ts';
import {
  Collection,
  Card,
  Player,
  Color,
  Game,
  Keyword,
  CardType,
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

runGame(dummyGame as any);
renderLog(dummyGame as any);

// helpers

function generateSampleDeck(): Collection<Card> {
  const sampleCards: Card[] = Array.from({ length: 12 }, (_, i) => ({
    id: `card${i + 1}`,
    name: `Card ${i + 1}`,
    type: CardType.Action,
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

function renderLog(game: Game) {
  const logDiv = document.createElement('div');
  logDiv.innerHTML = `<h2>Game Log</h2>`;

  const ul = document.createElement('ul');

  game.log.items.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `[Round ${entry.round}] ${entry.description}`;
    ul.appendChild(li);
  });

  logDiv.appendChild(ul);
  document.body.appendChild(logDiv);
}
