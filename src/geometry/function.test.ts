import { interpolate } from './function';

describe('interpolate', () => {
  test('calculates appropriate intermediate values', () => {
    const fn = interpolate([0, 2], [1, 3], [2, 1], [3, -10]);

    expect([0.1, 0.9, 1.1, 1.9, 2.1, 2.9].map(fn)).toMatchSnapshot();
  });

  test('hits the knots exactly', () => {
    const fn = interpolate([0, 2], [1, 3], [2, 1], [3, -10]);

    expect([0, 1, 2, 3].map(fn)).toEqual([2, 3, 1, -10]);
  });
});
