import GameMap from 'halite/GameMap';
import Planet from 'halite/Planet';
import Ship from 'halite/Ship';

import { findPlanetById, shipBelongsToPlayer } from './guards';
import { emptyMap } from './test/util';

describe('shipBelongsToPlayer', () => {
  test('returns true if the ship belongs to the player', () => {
    expect(shipBelongsToPlayer(new Ship(emptyMap, 0, {}), 0 as any)).toBe(true);
  });

  test('returns false if the ship does not belong to the player', () => {
    expect(shipBelongsToPlayer(new Ship(emptyMap, 0, {}), 1 as any)).toBe(
      false,
    );
  });
});

describe('findPlanetById', () => {
  test('returns the planet with given id', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlanets([{ id: 0, x: 10, y: 10 }]);

    expect(findPlanetById(0 as any, gm)).toBeInstanceOf(Planet);
  });

  test('returns undefined if no planet with given id exists', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlanets([{ id: 0, x: 10, y: 10 }]);

    expect(findPlanetById(1 as any, gm)).toBeUndefined();
  });
});
