type Game = {
  phase: GamePhase;
  subPhase: 'check_win_conditions' | 'drafting' | 'action';
  round: number;
  brennId: PlayerId | null;

  players: Collection<Player>;
  territories: Collection<Territory>;
  draftedHands: Record<PlayerId, Collection<Card>>; // hidden info
  discardedCards: Collection<Card>;
  deck: Collection<Card>;

  epicTales: Collection<Card>;
  deeds: Collection<Deed>;

  victoryClaims: Collection<VictoryClaim>; // tracks who has claimed victory conditions
  pendingChallenges: Collection<Clash>; // holds any unresolved conflicts or ties

  map: MapState;
  log: Collection<GameLogEntry>;
};

type PlayerId = string;

type Player = {
  id: PlayerId;
  name: string;
  color: Color;
  clans: Collection<Clan>; // current locations on map
  hand: Collection<Card>;
  epicTales: Collection<Card>[];
  deeds: Collection<Deed>;
  passed: boolean;
};

type Clan = {
  ownerId: PlayerId;
  location: TerritoryId;
};

type Territory = {
  id: TerritoryId;
  name: string;
  neighbors: Collection<TerritoryId>;
  sanctuaries: number;
  citadel: boolean;
  clans: Collection<Clan>;
};

type TerritoryId = string;

type Card = {
  id: string;
  name: string;
  type: 'action' | 'territory' | 'epicTale';
  description: string;
  effect: (game: Game, playerId: PlayerId) => void;
};

type Deed = {
  id: string;
  name: string;
  requirement: (game: Game, playerId: PlayerId) => boolean;
};

type VictoryClaim = {
  playerId: PlayerId;
  condition: WinCondition;
  valid: boolean;
};

type Clash = {
  instigator: PlayerId;
  defenders: Collection<PlayerId>;
  territory: TerritoryId;
  state: 'citadels_step' | 'pending' | 'resolved';
  resolution?: 'retreat' | 'discardCard' | 'removeClan';
};

type MapState = {
  explored: Collection<TerritoryId>;
  unexplored: Collection<TerritoryId>;
};

type GameLogEntry = {
  round: number;
  phase: string;
  description: string;
  timestamp: Date;
};

// -- Enums --

enum Color {
  White = 'white',
  Orange = 'orange',
  Green = 'green',
  Blue = 'blue',
}

enum WinCondition {
  Military = 'military_win_condition', // chieftan over cumulative six opposing clans
  Cultural = 'cultural_win_condition', // present with cumulative six sanctuaries
  Exploration = 'exploration_win_condition', // present in six territories
}

enum GamePhase {
  Assembly = 'assembly',
  Seasons = 'seasons',
  End = 'end',
}

enum Keyword {
  Assembly = 'Assembly',
  Seasons = 'Seasons',
  // game keywords live in ONE place!
}

// -- Utilities --

type Collection<T> = {
  items: T[];
  find: (id: string) => T | null;
  byId?: Record<string, T>; // optional lazy generated
};

export function runGame(game: Game) {
  while (game.phase != GamePhase.End) {
    switch (game.phase) {
      case GamePhase.Assembly:
        handleAssemblyPhase(game);
        break;
      case GamePhase.Seasons:
        handleSeasonsPhase(game);
        break;
    }

    game.round++;
  }

  const deck = generateSampleDeck();
  const players = createDummyPlayers();

  console.log({ deck, players });

  console.log('Game over!');
}

function handleAssemblyPhase(game: Game) {
  game.subPhase = 'check_win_conditions';

  if (checkVictoryConditions(game)) {
    game.phase = GamePhase.End;
    return;
  }

  assignBrenn(game);
  draftCards(game);
  game.subPhase = 'drafting';
}
function handleSeasonsPhase(game: Game) {
  game.subPhase = 'action';

  const activePlayers = game.players.items.filter((p) => !p.passed);

  while (activePlayers.some((p) => !p.passed)) {
    for (const player of activePlayers) {
      if (player.passed) continue;
      takeTurn(game, player);
    }
  }

  game.phase = GamePhase.Assembly; // Next round
}

function checkVictoryConditions(game: Game): boolean {
  return true;
}

function assignBrenn(game: Game) {}

function draftCards(game: Game) {}

function takeTurn(game: Game, player: Player) {
  // Check for new clashes, game events, victory triggers, etc.
  // Maybe break to Assembly if someone claims victory mid-round
}

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
