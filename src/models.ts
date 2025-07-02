export type Game = {
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

export type PlayerId = string;

export type Player = {
  id: PlayerId;
  name: string;
  color: Color;
  clans: Collection<Clan>; // current locations on map
  hand: Collection<Card>;
  epicTales: Collection<Card>[];
  deeds: Collection<Deed>;
  passed: boolean;
};

export type Clan = {
  ownerId: PlayerId;
  location: TerritoryId;
};

export type Territory = {
  id: TerritoryId;
  name: string;
  neighbors: Collection<TerritoryId>;
  sanctuaries: number;
  citadel: boolean;
  clans: Collection<Clan>;
};

export type TerritoryId = string;

export type Card = {
  id: string;
  name: string;
  type: CardType;
  description: string;
  effect: (game: Game, playerId: PlayerId) => void;
};

export type Deed = {
  id: string;
  name: string;
  requirement: (game: Game, playerId: PlayerId) => boolean;
};

export type VictoryClaim = {
  playerId: PlayerId;
  condition: WinCondition;
  valid: boolean;
};

export type Clash = {
  instigator: PlayerId;
  defenders: Collection<PlayerId>;
  territory: TerritoryId;
  state: 'citadels_step' | 'pending' | 'resolved';
  resolution?: 'retreat' | 'discardCard' | 'removeClan';
};

export type MapState = {
  explored: Collection<TerritoryId>;
  unexplored: Collection<TerritoryId>;
};

export type GameLogEntry = {
  round: number;
  phase: string;
  description: string;
  timestamp: Date;
};

// -- Enums --

export enum Color {
  White = 'white',
  Orange = 'orange',
  Green = 'green',
  Blue = 'blue',
}

export enum WinCondition {
  Military = 'military_win_condition', // chieftan over cumulative six opposing clans
  Cultural = 'cultural_win_condition', // present with cumulative six sanctuaries
  Exploration = 'exploration_win_condition', // present in six territories
}

export enum GamePhase {
  Assembly = 'assembly',
  Seasons = 'seasons',
  End = 'end',
}

export enum Keyword {
  Assembly = 'Assembly',
  Seasons = 'Seasons',
  // game keywords live in ONE place!
}

export enum CardType {
  Action = 'Card.Action',
  Territory = 'Card.Territory',
  Epic = 'Card.EpicTale',
}

// -- Utilities --

export type Collection<T> = {
  items: T[];
  find: (id: string) => T | null;
  byId?: Record<string, T>; // optional lazy generated
};
