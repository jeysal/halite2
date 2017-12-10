import { MAX_SPEED, SHIP_RADIUS } from 'halite/Constants';
import { Action } from 'halite/Game';
import GameMap from 'halite/GameMap';
import { distance } from 'halite/Geometry';
import Planet from 'halite/Planet';
import { OwnShip } from 'halite/Ship';

import { closestPoint } from '../../geometry/distance';
import { diameter, distanceFromCenterOfMap } from '../../geometry/game-map';

import Goal from '../goal';

const BASE_VALUE = 0.5;
const CENTRALITY_VALUE = 0.1;
const CLUSTERING_VALUE = 0.2;

export default class DockGoal<Turn = number> implements Goal<Turn> {
  constructor(private planet: Planet<Turn>) {}

  value(gm: GameMap<Turn>): number {
    const closestOwnPlanet = closestPoint(
      this.planet,
      gm.planets.filter(planet => planet.isOwnedByMe()),
    );

    return (
      BASE_VALUE +
      CENTRALITY_VALUE *
        (1 - distanceFromCenterOfMap(gm, this.planet) / (0.5 * diameter(gm))) +
      CLUSTERING_VALUE *
        (closestOwnPlanet
          ? 1 - distance(this.planet, closestOwnPlanet) / diameter(gm)
          : 0)
    );
  }

  minShips(): number {
    return 1;
  }
  maxShips(): number {
    return this.planet.dockingSpots;
  }

  suitability(ship: OwnShip<Turn>, gm: GameMap<Turn>): number {
    if (ship.isDocked()) {
      if (ship.dockedPlanetId === this.planet.id) return 1;
      return 0;
    }

    return 1 - distance(ship, this.planet) / diameter(gm);
  }

  strive(ship: OwnShip<Turn>): string & Action<Turn> {
    if (ship.canDock(this.planet)) return ship.dock(this.planet);

    return ship.navigate({
      target: this.planet,
      speed: MAX_SPEED,
      keepDistanceToTarget: this.planet.radius + SHIP_RADIUS,
    });
  }
}

export const determineDockGoals = <Turn>(gm: GameMap<Turn>): DockGoal<Turn>[] =>
  gm.planets
    .filter(planet => !planet.isOwnedByEnemy())
    .map(planet => new DockGoal(planet));
