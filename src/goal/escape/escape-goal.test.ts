import DockingStatus from 'halite/DockingStatus';
import GameMap from 'halite/GameMap';
import Ship, { OwnShip } from 'halite/Ship';

import { goalStats } from '../../test/goal';
import { emptyMap } from '../../test/util';

import EscapeGoal, { determineEscapeGoals } from './escape-goal';

describe('value', () => {
  test('is high if one enemy dominates the match and we are behind', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, [{}]);
    gm.addPlayerShips(1, [{}]);
    gm.addPlayerShips(2, Array(20).fill({}));

    expect(new EscapeGoal().value(gm)).toMatchSnapshot();
  });

  test('is high if we are the only losing party', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, [{}]);
    gm.addPlayerShips(1, Array(20).fill({}));
    gm.addPlayerShips(2, Array(20).fill({}));

    expect(new EscapeGoal().value(gm)).toMatchSnapshot();
  });

  test('is rather low if one enemy dominates the match, but we still stand a chance', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, Array(15).fill({}));
    gm.addPlayerShips(1, [{}]);
    gm.addPlayerShips(2, Array(25).fill({}));

    expect(new EscapeGoal().value(gm)).toMatchSnapshot();
  });

  test('is low if the match is even', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, Array(20).fill({}));
    gm.addPlayerShips(1, Array(20).fill({}));
    gm.addPlayerShips(2, Array(20).fill({}));

    expect(new EscapeGoal().value(gm)).toMatchSnapshot();
  });

  test('is very low if we dominate the match', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, Array(40).fill({}));
    gm.addPlayerShips(1, Array(20).fill({}));
    gm.addPlayerShips(2, [{}]);

    expect(new EscapeGoal().value(gm)).toMatchSnapshot();
  });

  test('is 0 if there is only two players remaining', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, [{}]);
    gm.addPlayerShips(1, Array(20).fill({}));

    expect(new EscapeGoal().value(gm)).toBe(0);
  });

  test('is 0 if there are few overall ships', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, [{}, {}, {}]);
    gm.addPlayerShips(1, [{}, {}, {}]);
    gm.addPlayerShips(2, [{}, {}, {}]);

    expect(new EscapeGoal().value(gm)).toBe(0);
  });
});

describe('minShips', () => {
  test('is 1', () => {
    expect(new EscapeGoal().minShips()).toBe(1);
  });
});
describe('maxShips', () => {
  test('is 3', () => {
    expect(new EscapeGoal().maxShips()).toBe(3);
  });
});

describe('suitability', () => {
  test('is high for a remote ship', () => {
    expect(
      new EscapeGoal().suitability(
        new Ship(emptyMap, 0, { x: 15, y: 15 }) as OwnShip,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });

  test('is rather low for a central ship', () => {
    expect(
      new EscapeGoal().suitability(
        new Ship(emptyMap, 0, { x: 35, y: 35 }) as OwnShip,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });
});

describe('strive', () => {
  test('navigates to the closest corner of the map', () => {
    expect(
      new EscapeGoal().strive(
        new Ship(emptyMap, 0, { id: 100, x: 90, y: 90 }) as OwnShip,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });

  test('undocks a docked ship', () => {
    expect(
      new EscapeGoal().strive(
        new Ship(emptyMap, 0, {
          id: 100,
          x: 99,
          y: 99,
          dockingStatus: DockingStatus.DOCKED,
        }) as OwnShip,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });
});

describe('determineEscapeGoals', () => {
  test('creates a single escape goal', () => {
    expect(
      determineEscapeGoals().map(goal =>
        goalStats(goal, new Ship(emptyMap, 0, { x: 15, y: 15 }), emptyMap),
      ),
    );
  });
});
