import { DOCK_RADIUS, MAX_SPEED, SHIP_RADIUS } from 'halite/Constants';
import { Action } from 'halite/Game';
import GameMap from 'halite/GameMap';
import { distance, Point } from 'halite/Geometry';
import { OwnPlanet } from 'halite/Planet';
import { OwnShip } from 'halite/Ship';

import { center } from '../../geometry/center';
import { closestDistance, closestPoint } from '../../geometry/distance';
import { interpolate } from '../../geometry/function';
import { diameter } from '../../geometry/game-map';
import Goal from '../goal';

const dangerForDistance = (radius: number, max: number) =>
  interpolate(
    [radius + DOCK_RADIUS, 0.9],
    [radius + DOCK_RADIUS + MAX_SPEED, 0.85],
    [radius + DOCK_RADIUS + 2 * MAX_SPEED, 0.75],
    [radius + DOCK_RADIUS + 3 * MAX_SPEED, 0.3],
    [radius + DOCK_RADIUS + 4 * MAX_SPEED, 0.15],
    [max, 0.1],
  );
const relevanceForDockedShips = interpolate([1, 0.5], [2, 0.7], [6, 0.9]);

const MAX_GUARDS_DOCK_RATIO = 2.5;

const UNDOCKED_SUITABILITY_RATIO = 0.5;

/**
 * The ship protec ...
 */
export default class ProtectGoal<Turn = number> implements Goal<Turn> {
  constructor(private ownPlanet: OwnPlanet<Turn>) {}

  value(gm: GameMap<Turn>): number {
    const gmDiameter = diameter(gm);
    const closestEnemyDistance = closestDistance(
      this.ownPlanet,
      gm.enemyShips,
      gmDiameter,
    );

    return (
      dangerForDistance(this.ownPlanet.radius, gmDiameter)(
        closestEnemyDistance,
      ) * relevanceForDockedShips(this.ownPlanet.numberOfDockedShips)
    );
  }

  minShips(): number {
    return 1;
  }
  maxShips(): number {
    return Math.round(
      MAX_GUARDS_DOCK_RATIO * this.ownPlanet.numberOfDockedShips,
    );
  }

  suitability(ship: OwnShip<Turn>, gm: GameMap<Turn>): number {
    return (
      UNDOCKED_SUITABILITY_RATIO * (ship.isUndocked() ? 1 : 0) +
      (1 - UNDOCKED_SUITABILITY_RATIO) *
        (1 - distance(this.ownPlanet, ship) / diameter(gm))
    );
  }

  strive(ship: OwnShip<Turn>, gm: GameMap<Turn>): string & Action<Turn> {
    if (ship.isDocked()) return ship.unDock();
    return ship.navigate({
      target: {
        ...center([
          this.ownPlanet,
          // enemyShips cannot be empty, so closestPoint cannot be undefined
          closestPoint(this.ownPlanet, gm.enemyShips) as Point,
        ]),
        id: -1,
        radius: 1,
      },
      speed: MAX_SPEED,
      keepDistanceToTarget: SHIP_RADIUS * 2,
    });
  }
}

export const determineProtectGoals = <Turn>(
  gm: GameMap<Turn>,
): ProtectGoal<Turn>[] =>
  gm.planets
    .filter(planet => planet.isOwnedByMe())
    .map(planet => new ProtectGoal(planet as OwnPlanet<Turn>));
