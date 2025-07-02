import {
  Game,
  GamePhase,
  Card,
  Player,
  Keyword,
  Clan,
  Territory,
  Collection,
} from './models';

// entry point
export function runGame(game: Game) {
  log(game, 'game starting');
  setupGame(game);

  while (game.phase != GamePhase.End) {
    switch (game.phase) {
      case GamePhase.Assembly:
        log(game, 'assembly phase', Keyword.Assembly);
        handleAssemblyPhase(game);
        break;
      case GamePhase.Seasons:
        log(game, 'seasons phase', Keyword.Seasons);
        handleSeasonsPhase(game);
        game.round++;
        log(game, 'NEXT ROUND');
        break;
    }
  }

  log(game, 'Game over!');
}

function handleAssemblyPhase(game: Game) {
  game.subPhase = 'check_win_conditions';

  if (checkVictoryConditions(game)) {
    game.phase = GamePhase.End;
    return;
  }

  // assignBrenn(game);

  // draftCards(game);

  game.phase = GamePhase.Seasons;
}

function handleSeasonsPhase(game: Game) {
  game.subPhase = 'action';

  const activePlayers = game.players.items.filter((p) => !p.passed);

  // while (activePlayers.some((p) => !p.passed)) {
  //   for (const player of activePlayers) {
  //     if (player.passed) continue;
  //     takeTurn(game, player);
  //   }
  // }

  game.phase = GamePhase.Assembly; // Next round
}

function checkVictoryConditions(game: Game): boolean {
  if (game.round >= 3) {
    return true;
  }
  return false;
}

function assignBrenn(game: Game) {}

function draftCards(game: Game) {
  const numPlayers = game.players.items.length;
  const handSize = 4;

  // Step 1: Deal hands
  let hands: Card[][] = [];
  for (let i = 0; i < numPlayers; i++) {
    const hand = game.deck.items.splice(0, handSize);
    hands.push(hand);
  }

  // Step 2: Draft (pick one, pass left)
  const picked: Card[][] = Array.from({ length: numPlayers }, () => []);

  for (let round = 0; round < handSize; round++) {
    for (let i = 0; i < numPlayers; i++) {
      const currentHand = hands[i];
      const chosen = currentHand.shift(); // Simulate a choice
      if (chosen) picked[i].push(chosen);
    }

    // Rotate hands to the left
    hands = hands.map((_, i) => hands[(i + 1) % numPlayers]);
  }

  // Step 3: Assign final hands
  game.players.items.forEach((p, i) => {
    p.hand = {
      items: picked[i],
      find: (id) => picked[i].find((c) => c.id === id) || null,
    };
  });
}

function takeTurn(game: Game, player: Player) {
  // Check for new clashes, game events, victory triggers, etc.
  // Maybe break to Assembly if someone claims victory mid-round
}

export function log(game: Game, message: string, keyword: string = '') {
  game.log.items.push({
    round: game.round,
    phase: keyword,
    description: message,
    timestamp: new Date(),
  });
}

function setupGame(game: Game) {
  console.log('setting game up...');
  layoutStartingTerritories(game);
  placeStartingClans(game);
  // assignBrenn(game);
  game.round++;
}

function layoutStartingTerritories(game: Game) {
  const numPlayers = game.players.items.length;

  const territoryPool = createTerritoryPool(); // helper we'll define
  const startingTerritories = territoryPool.splice(0, numPlayers);

  game.map.explored = {
    items: startingTerritories.map((t) => t.id),
    find: (id) =>
      startingTerritories.map((t) => t.id).find((t) => t === id) || null,
  };

  game.territories = {
    items: startingTerritories,
    find: (id) => startingTerritories.find((t) => t.id === id) || null,
  };

  log(
    game,
    `Laid out ${numPlayers} starting territories ${startingTerritories
      .map((t) => t.name)
      .join(', ')}`
  );
}

function createTerritoryPool(): Territory[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `territory${i + 1}`,
    name: `Territory ${i + 1}`,
    neighbors: { items: [], find: () => null },
    sanctuaries: 0,
    citadel: false,
    clans: { items: [], find: () => null },
  }));
}

function placeStartingClans(game: Game) {
  const players = game.players.items;
  const territories = game.map.explored.items;

  for (let round = 0; round < 2; round++) {
    for (const player of players) {
      const target =
        territories[Math.floor(Math.random() * territories.length)];

      const clan: Clan = {
        ownerId: player.id,
        location: target,
      };

      player.clans.items.push(clan);
      // target.clans.items.push(clan);

      log(game, `${player.name} places a clan in ${target}`);
    }
  }
}
