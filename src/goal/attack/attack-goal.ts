import { MAX_SPEED } from 'halite/Constants';
import { Action } from 'halite/Game';
import GameMap from 'halite/GameMap';
import { distance } from 'halite/Geometry';
import { EnemyShip, OwnShip } from 'halite/Ship';

import { center } from '../../geometry/center';
import { dbscan } from '../../geometry/clustering';
import { diameter } from '../../geometry/game-map';
import { findPlanetById } from '../../guards';
import DockGoal from '../dock/dock-goal';
import Goal from '../goal';

const BASE_VALUE = 0.2;
const valueForSwarmSize = (x: number): number => 0.5 * x * x / (x * x + 4 * x);
const DOCK_VALUE_RATIO = 0.75;

const MIN_SWARM_SIZE_RATIO = 1.2;
const MAX_SWARM_SIZE_RATIO = 2.5;

const UNDOCKED_SUITABILITY_RATIO = 0.4;

/**
 * ... but it also attac
 */
export default class AttackGoal<Turn> implements Goal<Turn> {
  constructor(private enemySwarm: EnemyShip<Turn>[]) {}

  value(gm: GameMap<Turn>): number {
    let value = BASE_VALUE + valueForSwarmSize(this.enemySwarm.length);

    const dockedShip = this.enemySwarm.find(
      enemyShip => !enemyShip.isUndocked(),
    );
    if (dockedShip)
      value =
        DOCK_VALUE_RATIO *
          new DockGoal(findPlanetById(dockedShip.dockedPlanetId, gm)).value(
            gm,
          ) +
        (1 - DOCK_VALUE_RATIO) * value;

    return value;
  }

  minShips(): number {
    return Math.round(
      this.enemySwarm.filter(enemyShip => enemyShip.isUndocked()).length *
        MIN_SWARM_SIZE_RATIO,
    );
  }
  maxShips(): number {
    return Math.ceil(this.enemySwarm.length * MAX_SWARM_SIZE_RATIO);
  }

  suitability(ship: OwnShip<Turn>, gm: GameMap<Turn>): number {
    return (
      UNDOCKED_SUITABILITY_RATIO * (ship.isUndocked() ? 1 : 0) +
      (1 - UNDOCKED_SUITABILITY_RATIO) *
        (1 - distance(ship, center(this.enemySwarm)) / diameter(gm))
    );
  }

  strive(ship: OwnShip<Turn>): string & Action<Turn> {
    if (ship.isDocked()) return ship.unDock();

    return ship.navigate({
      target: { ...center(this.enemySwarm), id: -1, radius: 1 },
      speed: MAX_SPEED,
    });
  }
}

const DBSCAN_EPSILON = 1.5 * MAX_SPEED;

export const determineAttackGoals = <Turn>(
  gm: GameMap<Turn>,
): AttackGoal<Turn>[] =>
  dbscan(gm.enemyShips, DBSCAN_EPSILON, 1).map(swarm => new AttackGoal(swarm)); // minPts = 1, so this is effectively hierarchical clustering
