import DockingStatus from 'halite/DockingStatus';
import GameMap from 'halite/GameMap';
import Planet, { OwnPlanet } from 'halite/Planet';
import Ship, { OwnShip } from 'halite/Ship';

import { goalStats } from '../../test/goal';
import { emptyMap } from '../../test/util';

import ProtectGoal, { determineProtectGoals } from './protect-goal';

describe('value', () => {
  test('is high if an enemy is close', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, [{ ownerId: 0, x: 17, y: 17 }]);
    gm.addPlayerShips(1, [{ ownerId: 1, x: 15, y: 15 }]);

    expect(
      new ProtectGoal(new Planet(gm, {
        ownerId: 0,
        x: 20,
        y: 20,
        radius: 3,
        dockedShipIds: [100, 101],
      }) as OwnPlanet).value(gm),
    ).toMatchSnapshot();
  });

  test('is low if no enemy is close', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, [{ ownerId: 0, x: 17, y: 17 }]);
    gm.addPlayerShips(1, [{ ownerId: 1, x: 85, y: 85 }]);

    expect(
      new ProtectGoal(new Planet(gm, {
        ownerId: 0,
        x: 20,
        y: 20,
        radius: 3,
        dockedShipIds: [100, 101],
      }) as OwnPlanet).value(gm),
    ).toMatchSnapshot();
  });

  test('is high if many ships are docked', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, [{ ownerId: 0, x: 17, y: 17 }]);
    gm.addPlayerShips(1, [{ ownerId: 1, x: 35, y: 35 }]);

    expect(
      new ProtectGoal(new Planet(gm, {
        ownerId: 0,
        x: 20,
        y: 20,
        radius: 3,
        dockedShipIds: [100, 101, 102, 103, 104, 105],
      }) as OwnPlanet).value(gm),
    ).toMatchSnapshot();
  });

  test('is low if just one ship is docked', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(0, [{ ownerId: 0, x: 17, y: 17 }]);
    gm.addPlayerShips(1, [{ ownerId: 1, x: 35, y: 35 }]);

    expect(
      new ProtectGoal(new Planet(gm, {
        ownerId: 0,
        x: 20,
        y: 20,
        radius: 3,
        dockedShipIds: [100],
      }) as OwnPlanet).value(gm),
    ).toMatchSnapshot();
  });
});

describe('minShips', () => {
  test('is 1', () => {
    expect(
      new ProtectGoal(new Planet(emptyMap, {
        dockedShipIds: [100],
      }) as OwnPlanet).minShips(),
    ).toBe(1);
  });
});
describe('maxShips', () => {
  test('returns a reasonable maximum for a planet with 1 docked ship', () => {
    expect(
      new ProtectGoal(new Planet(emptyMap, {
        dockedShipIds: [100],
      }) as OwnPlanet).maxShips(),
    ).toMatchSnapshot();
  });

  test('returns a reasonable maximum for a planet with many docked ships', () => {
    expect(
      new ProtectGoal(new Planet(emptyMap, {
        dockedShipIds: [100, 101, 102, 103, 104, 105],
      }) as OwnPlanet).maxShips(),
    ).toMatchSnapshot();
  });
});

describe('suitability', () => {
  test('is high for an undocked nearby ship', () => {
    expect(
      new ProtectGoal(new Planet(emptyMap, {
        x: 15,
        y: 15,
      }) as OwnPlanet).suitability(
        new Ship(emptyMap, 0, {
          x: 20,
          y: 20,
          dockingStatus: DockingStatus.UNDOCKED,
        }) as OwnShip,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });

  test('is low for a docked nearby ship', () => {
    expect(
      new ProtectGoal(new Planet(emptyMap, {
        x: 15,
        y: 15,
      }) as OwnPlanet).suitability(
        new Ship(emptyMap, 0, {
          x: 20,
          y: 20,
          dockingStatus: DockingStatus.DOCKED,
        }) as OwnShip,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });

  test('is low for an undocked distant ship', () => {
    expect(
      new ProtectGoal(new Planet(emptyMap, {
        x: 15,
        y: 15,
      }) as OwnPlanet).suitability(
        new Ship(emptyMap, 0, {
          x: 100,
          y: 100,
          dockingStatus: DockingStatus.UNDOCKED,
        }) as OwnShip,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });
});

describe('strive', () => {
  test('navigates between the planet and the closest enemy ship', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlayerShips(1, [{ x: 20, y: 20 }]);

    expect(
      new ProtectGoal(new Planet(gm, { x: 10, y: 10 }) as OwnPlanet).strive(
        new Ship(gm, 0, {
          id: 100,
          x: 10,
          y: 20,
          dockingStatus: DockingStatus.UNDOCKED,
        }) as OwnShip,
        gm,
      ),
    ).toMatchSnapshot();
  });

  test('undocks a docked ship', () => {
    expect(
      new ProtectGoal(new Planet(emptyMap, {}) as OwnPlanet).strive(
        new Ship(emptyMap, 0, {
          id: 100,
          dockingStatus: DockingStatus.DOCKED,
        }) as OwnShip,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });
});

describe('determineProtectGoals', () => {
  test('creates a protect goal for each own planet', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlanets([
      {
        id: 1000,
        ownerId: 0,
        x: 10,
        y: 10,
        radius: 3,
        dockedShipIds: [100, 101],
      },
    ]);
    gm.addPlayerShips(0, [
      {
        id: 100,
        x: 15,
        y: 15,
        radius: 1,
        dockingStatus: DockingStatus.DOCKED,
        dockedPlanetId: 1000,
      },
      {
        id: 101,
        x: 5,
        y: 15,
        radius: 1,
        dockingStatus: DockingStatus.DOCKED,
        dockedPlanetId: 1000,
      },
    ]);
    gm.addPlayerShips(1, [
      {
        id: 200,
        x: 20,
        y: 20,
        radius: 1,
        dockingStatus: DockingStatus.UNDOCKED,
      },
    ]);

    expect(
      determineProtectGoals(gm).map(goal =>
        goalStats(
          goal,
          new Ship(gm, 0, {
            id: 110,
            x: 10,
            y: 20,
            radius: 1,
            dockingStatus: DockingStatus.UNDOCKED,
          }),
          gm,
        ),
      ),
    ).toMatchSnapshot();
  });
});
