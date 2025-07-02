import { CARD_TEMPLATES } from './data/cards';
import { TERRITORY_TEMPLATES } from './data/territories';
import { Card, Collection, Territory } from './models';

export function createTerritoryInstances(): Territory[] {
  return TERRITORY_TEMPLATES.map((template) => ({
    id: template.id,
    name: template.name,
    sanctuaries: template.hasSanctuary ? 1 : 0,
    citadel: template.hasCitadel,
    neighbors: { items: [], find: () => null },
    clans: { items: [], find: () => null },
  }));
}

export function createDeckFromTemplates(): Collection<Card> {
  return {
    items: CARD_TEMPLATES.map((c) => ({ ...c })),
    find: (id) => CARD_TEMPLATES.find((c) => c.id === id) || null,
  };
}
