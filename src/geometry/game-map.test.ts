import GameMap from 'halite/GameMap';

import { centerOfMap, diameter, distanceFromCenterOfMap } from './game-map';

describe('center', () => {
  test('calculates the center of the map', () => {
    expect(
      centerOfMap(new GameMap({ myPlayerId: 0, width: 100, height: 100 })),
    ).toEqual({ x: 50, y: 50 });
  });
});

describe('distanceFromCenter', () => {
  test('calculates the distance from the center of the map', () => {
    expect(
      distanceFromCenterOfMap(
        new GameMap({ myPlayerId: 0, width: 100, height: 100 }),
        { x: 53, y: 54 },
      ),
    ).toBe(5);
  });
});

describe('diameter', () => {
  test('calculates the diameter of the map', () => {
    expect(
      diameter(new GameMap({ myPlayerId: 0, width: 30, height: 40 })),
    ).toBe(50);
  });
});
