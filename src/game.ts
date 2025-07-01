import { Game, GamePhase, Card, Player, Keyword } from './models';

// entry point
export function runGame(game: Game) {
  log(game, 'game starting');

  while (game.phase != GamePhase.End) {
    switch (game.phase) {
      case GamePhase.Assembly:
        log(game, 'assembly phase', Keyword.Assembly);
        handleAssemblyPhase(game);
        break;
      case GamePhase.Seasons:
        log(game, 'seasons phase');
        handleSeasonsPhase(game);
        break;
    }

    game.round++;
  }

  log(game, 'Game over!');
  let logs: any[] = [];
  game.log.items.forEach((i) => logs.push(i));
  console.table('Game Log', logs);
}

function handleAssemblyPhase(game: Game) {
  game.subPhase = 'check_win_conditions';

  if (checkVictoryConditions(game)) {
    game.phase = GamePhase.End;
    return;
  }

  assignBrenn(game);

  game.subPhase = 'drafting';
  draftCards(game);
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
  if (game.round == 2) {
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

  game.players.items.forEach((p) => {
    console.log(
      `${p.name}'s hand:`,
      p.hand.items.map((c) => c.name)
    );
  });
}

function takeTurn(game: Game, player: Player) {
  // Check for new clashes, game events, victory triggers, etc.
  // Maybe break to Assembly if someone claims victory mid-round
}

function log(game: Game, message: string, keyword: string = '') {
  game.log.items.push({
    round: game.round,
    phase: keyword,
    description: message,
    timestamp: new Date(),
  });
}
