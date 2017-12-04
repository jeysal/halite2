import { Point } from 'halite/Geometry';
import Planet from 'halite/Planet';

import { emptyMap } from '../test/util';

import { closestFreePlanet } from './distance';

describe('closestFreePlanet', () => {
  test('selects the planet closest to the origin', () => {
    const origin: Point = { x: 0, y: 0 };
    const closest: Planet = new Planet(emptyMap, { x: -1, y: 1 });

    expect(
      closestFreePlanet(origin, [
        new Planet(emptyMap, { x: 2, y: 0 }),
        closest,
        new Planet(emptyMap, { x: 2, y: 2 }),
        new Planet(emptyMap, { x: 1, y: -2 }),
      ]),
    ).toBe(closest);
  });

  test('does not select a non-free planet', () => {
    const origin: Point = { x: 0, y: 0 };
    const free: Planet = new Planet(emptyMap, { x: 5, y: 7 });

    expect(
      closestFreePlanet(origin, [
        new Planet(emptyMap, { x: 0, y: 1, ownerId: 0 }),
        free,
        new Planet(emptyMap, { x: 1, y: 0, ownerId: 1 }),
      ]),
    ).toBe(free);
  });

  test('returns undefined for an empty array of planets', () => {
    expect(closestFreePlanet({ x: 0, y: 0 }, [])).toBeUndefined();
  });
});
