import { log } from '../game';
import { CardType, Game, PlayerId } from '../models';

export const CARD_TEMPLATES = [
  {
    id: 'c1',
    name: 'March of the Clans',
    type: 'Card.Action' as CardType,
    description: 'Move up to 3 clans.',
    effect: (game: Game, playerId: PlayerId) => {
      log(game, `${playerId} moves clans with March of the Clans`);
    },
  },
  // more cards...
];
