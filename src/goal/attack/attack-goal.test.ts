import DockingStatus from 'halite/DockingStatus';
import GameMap from 'halite/GameMap';
import Ship, { EnemyShip } from 'halite/Ship';

import { emptyMap } from '../../test/util';

import AttackGoal from './attack-goal';

describe('value', () => {
  test('is low for a swarm that just floats around', () => {
    const enemySwarm: EnemyShip[] = [
      new Ship(emptyMap, 1, { dockingStatus: DockingStatus.UNDOCKED }),
      new Ship(emptyMap, 1, { dockingStatus: DockingStatus.UNDOCKED }),
    ] as any;

    expect(new AttackGoal(enemySwarm).value(emptyMap)).toMatchSnapshot();
  });

  test('is high for a swarm that guards a docked planet', () => {
    const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
    gm.addPlanets([{ id: 42, x: 15, y: 15 }]);
    const enemySwarm: EnemyShip[] = [
      new Ship(gm, 1, {
        dockingStatus: DockingStatus.DOCKED,
        dockedPlanetId: 42,
      }),
      new Ship(gm, 1, { dockingStatus: DockingStatus.UNDOCKED }),
    ] as any;

    expect(new AttackGoal(enemySwarm).value(gm)).toMatchSnapshot();
  });
});

describe('minShips', () => {
  test('returns a reasonable minimum for a small enemy swarm', () => {
    expect(new AttackGoal(Array(1)).minShips()).toMatchSnapshot();
  });

  test('returns a reasonable minimum for a large enemy swarm', () => {
    expect(new AttackGoal(Array(8)).minShips()).toMatchSnapshot();
  });
});

describe('maxShips', () => {
  test('returns a reasonable maximum for a small enemy swarm', () => {
    expect(new AttackGoal(Array(1)).maxShips()).toMatchSnapshot();
  });

  test('returns a reasonable maximum for a large enemy swarm', () => {
    expect(new AttackGoal(Array(8)).maxShips()).toMatchSnapshot();
  });
});

describe('suitability', () => {
  test('is high for an undocked nearby ship', () => {
    expect(
      new AttackGoal([
        new Ship(emptyMap, 1, { x: 10, y: 10 }),
        new Ship(emptyMap, 1, { x: 12, y: 8 }),
      ] as any).suitability(
        new Ship(emptyMap, 0, {
          x: 20,
          y: 20,
          dockingStatus: DockingStatus.UNDOCKED,
        }) as any,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });

  test('is low for a docked nearby ship', () => {
    expect(
      new AttackGoal([
        new Ship(emptyMap, 1, { x: 10, y: 10 }),
        new Ship(emptyMap, 1, { x: 12, y: 8 }),
      ] as any).suitability(
        new Ship(emptyMap, 0, {
          x: 20,
          y: 20,
          dockingStatus: DockingStatus.DOCKED,
        }) as any,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });

  test('is low for an undocked distant ship', () => {
    expect(
      new AttackGoal([
        new Ship(emptyMap, 1, { x: 10, y: 10 }),
        new Ship(emptyMap, 1, { x: 12, y: 8 }),
      ] as any).suitability(
        new Ship(emptyMap, 0, {
          x: 80,
          y: 80,
          dockingStatus: DockingStatus.UNDOCKED,
        }) as any,
        emptyMap,
      ),
    ).toMatchSnapshot();
  });
});

describe('strive', () => {
  test('navigates towards the enemy swarm', () => {
    expect(
      new AttackGoal([new Ship(emptyMap, 1, { x: 15, y: 15 }) as any]).strive(
        new Ship(emptyMap, 0, { id: 42, x: 50, y: 50 }) as any,
      ),
    ).toMatchSnapshot();
  });

  test('undocks a docked ship', () => {
    expect(
      new AttackGoal([new Ship(emptyMap, 1, { x: 15, y: 15 }) as any]).strive(
        new Ship(emptyMap, 0, {
          id: 42,
          x: 50,
          y: 50,
          dockingStatus: DockingStatus.DOCKED,
        }) as any,
      ),
    ).toMatchSnapshot();
  });
});
