import DockingStatus from 'halite/DockingStatus';
import GameMap from 'halite/GameMap';
import Planet from 'halite/Planet';
import Ship, { OwnShip } from 'halite/Ship';

import { emptyMap } from '../../test/util';

import DockGoal from './dock-goal';

describe('value', () => {
  test('is appropriate for a central planet', () => {
    expect(
      new DockGoal(new Planet(emptyMap, { x: 50, y: 50 })).value(emptyMap),
    ).toMatchSnapshot();
  });

  test('is appropriate for a remote planet', () => {
    expect(
      new DockGoal(new Planet(emptyMap, { x: 15, y: 15 })).value(emptyMap),
    ).toMatchSnapshot();
  });

  test('is high if nearby planets are already owned', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlanets([{ x: 10, y: 10, ownerId: 0 }]);
    gm.addPlanets([{ x: 90, y: 90, ownerId: 1 }]);
    expect(
      new DockGoal(new Planet(gm, { x: 15, y: 15 })).value(gm),
    ).toMatchSnapshot();
  });

  test('is low if no nearby planets are already owned', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlanets([{ x: 10, y: 10, ownerId: 1 }]);
    gm.addPlanets([{ x: 90, y: 90, ownerId: 0 }]);
    expect(
      new DockGoal(new Planet(gm, { x: 15, y: 15 })).value(gm),
    ).toMatchSnapshot();
  });
});

describe('minShips', () => {
  test('is 1', () => {
    expect(new DockGoal(new Planet(emptyMap, {})).minShips()).toBe(1);
  });
});
describe('maxShips', () => {
  test('is equal to the number of docking spots', () => {
    expect(
      new DockGoal(new Planet(emptyMap, { dockingSpots: 3 })).maxShips(),
    ).toBe(3);
  });
});

describe('suitability', () => {
  test('is 1 for a ship already docked there', () => {
    expect(
      new DockGoal(new Planet(emptyMap, { id: 42 })).suitability(
        new Ship(emptyMap, 0, {
          dockingStatus: DockingStatus.DOCKED,
          dockedPlanetId: 42,
        }) as OwnShip,
        emptyMap,
      ),
    ).toBe(1);
  });

  test('is 0 for a ship docked elsewhere', () => {
    expect(
      new DockGoal(new Planet(emptyMap, { id: 42 })).suitability(
        new Ship(emptyMap, 0, {
          dockingStatus: DockingStatus.DOCKED,
          dockedPlanetId: 1337,
        }) as OwnShip,
        emptyMap,
      ),
    ).toBe(0);
  });

  test('is appropriate for a nearby ship', () => {
    expect(
      new DockGoal(new Planet(emptyMap, { id: 42, x: 15, y: 15 })).suitability(
        new Ship(emptyMap, 0, {
          dockingStatus: DockingStatus.UNDOCKED,
          x: 10,
          y: 10,
        }) as OwnShip,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });

  test('is appropriate for a distant ship', () => {
    expect(
      new DockGoal(new Planet(emptyMap, { id: 42, x: 15, y: 15 })).suitability(
        new Ship(emptyMap, 0, {
          dockingStatus: DockingStatus.UNDOCKED,
          x: 90,
          y: 90,
        }) as OwnShip,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });
});

describe('strive', () => {
  test('docks at a dockable planet', () => {
    expect(
      new DockGoal(
        new Planet(emptyMap, {
          id: 42,
          x: 15,
          y: 15,
          radius: 4.5,
          dockingSpots: 3,
          dockedShipIds: [100],
        }),
      ).strive(new Ship(emptyMap, 0, {
        id: 105,
        dockingStatus: DockingStatus.UNDOCKED,
        x: 10,
        y: 10,
      }) as OwnShip),
    ).toMatchSnapshot();
  });

  test('navigates towards a non-dockable planet', () => {
    expect(
      new DockGoal(
        new Planet(emptyMap, {
          id: 42,
          x: 15,
          y: 15,
          radius: 4.5,
          dockingSpots: 3,
          dockedShipIds: [100],
        }),
      ).strive(new Ship(emptyMap, 0, {
        id: 105,
        dockingStatus: DockingStatus.UNDOCKED,
        x: 90,
        y: 90,
      }) as OwnShip),
    ).toMatchSnapshot();
  });
});
