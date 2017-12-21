import { MAX_SPEED, SHIP_RADIUS } from 'halite/Constants';
import { Action } from 'halite/Game';
import GameMap from 'halite/GameMap';
import { OwnShip } from 'halite/Ship';
import { groupBy, max } from 'ramda';

import { closestPoint } from '../../geometry/distance';
import {
  cornersOfMap,
  diameter,
  distanceFromCenterOfMap,
} from '../../geometry/game-map';
import Goal from '../goal';

const ENEMY_DOMINANCE_MINIMUM = 15;
const ENEMY_DOMINANCE_RATIO = 2.5;

export default class EscapeGoal<Turn = number> implements Goal<Turn> {
  value(gm: GameMap<Turn>): number {
    const shipsPerEnemy = Object.values(
      groupBy(({ ownerId }) => `${ownerId}`, gm.enemyShips),
    );

    // No point in fleeing if it's only them vs us
    if (shipsPerEnemy.length < 2) return 0;

    const highestEnemyShipCount = shipsPerEnemy
      .map(({ length }) => length)
      .reduce(max);

    if (highestEnemyShipCount < ENEMY_DOMINANCE_MINIMUM) return 0;

    return Math.min(
      highestEnemyShipCount / (ENEMY_DOMINANCE_RATIO * gm.myShips.length),
      1,
    );
  }

  minShips(): number {
    return 1;
  }
  maxShips(): number {
    return 3;
  }

  suitability(ship: OwnShip<Turn>, gm: GameMap<Turn>): number {
    // sqrt this a few times because a central ship is still not that bad for fleeing.
    // If value is high enough, we definitely want to make the escape now.
    return Math.sqrt(
      Math.sqrt(distanceFromCenterOfMap(gm, ship) / (0.5 * diameter(gm))),
    );
  }

  strive(ship: OwnShip<Turn>, gm: GameMap<Turn>): string & Action<Turn> {
    if (ship.isDocked()) return ship.unDock();

    return ship.navigate({
      target: closestPoint(ship, cornersOfMap(gm)),
      speed: MAX_SPEED,
      keepDistanceToTarget: MAX_SPEED + SHIP_RADIUS,
    });
  }
}

export const determineEscapeGoals = <Turn>(): EscapeGoal<Turn>[] => [
  new EscapeGoal(),
];
