import { dbscan } from './clustering';

describe('dbscan', () => {
  test('clusters points correctly', () => {
    expect(
      dbscan(
        [
          { x: 0, y: 0.5 },
          { x: 3, y: 1.2 },
          { x: -2, y: 3 },
          { x: 0.7, y: 1 },
          { x: 7.5, y: -10 },
          { x: 8.3, y: -8 },
          { x: 5, y: -10 },
          { x: 10, y: 1.1 },
          { x: 9.4, y: -1 },
        ],
        5,
        3,
      ),
    ).toMatchSnapshot();
  });
});
