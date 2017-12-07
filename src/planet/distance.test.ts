import Planet from 'halite/Planet';
import Ship from 'halite/Ship';

import { emptyMap } from '../test/util';

import { closestDockingCandidate } from './distance';

describe('closestDockingCandidate', () => {
  test('selects the planet closest to the origin', () => {
    const ship: Ship = new Ship(emptyMap, 0, { x: 0, y: 0 });
    const closest: Planet = new Planet(emptyMap, {
      x: -1,
      y: 1,
      dockingSpots: 3,
      dockedShipIds: [],
    });

    expect(
      closestDockingCandidate(ship, [
        new Planet(emptyMap, {
          x: 2,
          y: 0,
          dockingSpots: 3,
          dockedShipIds: [],
        }),
        closest,
        new Planet(emptyMap, {
          x: 2,
          y: 2,
          dockingSpots: 3,
          dockedShipIds: [],
        }),
        new Planet(emptyMap, {
          x: 1,
          y: -2,
          dockingSpots: 3,
          dockedShipIds: [],
        }),
      ]),
    ).toBe(closest);
  });

  test('includes own planets', () => {
    const ship: Ship = new Ship(emptyMap, 0, { x: 0, y: 0 });
    const closest: Planet = new Planet(emptyMap, {
      x: -1,
      y: 1,
      ownerId: 0,
      dockingSpots: 3,
      dockedShipIds: [100],
    });

    expect(
      closestDockingCandidate(ship, [
        new Planet(emptyMap, {
          x: 2,
          y: 0,
          dockingSpots: 3,
          dockedShipIds: [],
        }),
        closest,
        new Planet(emptyMap, {
          x: 2,
          y: 2,
          dockingSpots: 3,
          dockedShipIds: [],
        }),
        new Planet(emptyMap, {
          x: 1,
          y: -2,
          dockingSpots: 3,
          dockedShipIds: [],
        }),
      ]),
    ).toBe(closest);
  });

  test('does not select a full planet', () => {
    const ship: Ship = new Ship(emptyMap, 0, { x: 0, y: 0 });
    const closest: Planet = new Planet(emptyMap, {
      x: 0,
      y: 2,
      dockingSpots: 3,
      dockedShipIds: [],
    });

    expect(
      closestDockingCandidate(ship, [
        new Planet(emptyMap, {
          x: -1,
          y: 1,
          ownerId: 0,
          dockingSpots: 3,
          dockedShipIds: [100, 101, 102],
        }),

        closest,
        new Planet(emptyMap, {
          x: 2,
          y: 2,
          dockingSpots: 3,
          dockedShipIds: [],
        }),
        new Planet(emptyMap, {
          x: 1,
          y: -2,
          dockingSpots: 3,
          dockedShipIds: [],
        }),
      ]),
    ).toBe(closest);
  });

  test('does not select an enemy planet', () => {
    const ship: Ship = new Ship(emptyMap, 0, { x: 0, y: 0 });
    const free: Planet = new Planet(emptyMap, {
      x: 5,
      y: 7,
      dockingSpots: 3,
      dockedShipIds: [100],
    });

    expect(
      closestDockingCandidate(ship, [
        new Planet(emptyMap, { x: 0, y: 1, ownerId: 1 }),
        free,
        new Planet(emptyMap, { x: 1, y: 0, ownerId: 2 }),
      ]),
    ).toBe(free);
  });

  test('returns undefined for an empty array of planets', () => {
    expect(
      closestDockingCandidate(new Ship(emptyMap, 0, { x: 0, y: 0 }), []),
    ).toBeUndefined();
  });
});
