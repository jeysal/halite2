import { Point } from 'halite/Geometry';

import { closestPoint } from './distance';

describe('closestPoint', () => {
  test('selects the point closest to the origin', () => {
    const origin: Point = { x: 0, y: 0 };
    const closest: Point = { x: -1, y: 1 };

    expect(
      closestPoint(origin, [
        { x: 2, y: 0 },
        closest,
        { x: 2, y: 2 },
        { x: 1, y: -2 },
      ]),
    ).toBe(closest);
  });

  test('returns undefined for an empty array of points', () => {
    expect(closestPoint({ x: 0, y: 0 }, [])).toBeUndefined();
  });
});
