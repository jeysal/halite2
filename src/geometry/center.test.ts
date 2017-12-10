import { center } from './center';

describe('center', () => {
  test('finds the center of the points', () => {
    expect(center([{ x: 1, y: 3 }, { x: 5, y: 1 }])).toEqual({ x: 3, y: 2 });
  });
});
