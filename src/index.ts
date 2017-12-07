import { MAX_SPEED, SHIP_RADIUS } from 'halite/Constants';
import { Action, start } from 'halite/Game';
import GameMap from 'halite/GameMap';

import { closestPoint } from './geometry/distance';
import { closestDockingCandidate } from './planet/distance';

start({
  strategy,
  botName: 'jeysal',
  preProcessing: () => {},
});

function strategy<Turn>(
  gameMap: GameMap<Turn>,
): ((string & Action<Turn>) | null)[] {
  return gameMap.myShips.map(ship => {
    const dockingCandidate = closestDockingCandidate(ship, gameMap.planets);
    if (dockingCandidate) {
      if (ship.canDock(dockingCandidate)) return ship.dock(dockingCandidate);
      return ship.navigate({
        target: dockingCandidate,
        speed: MAX_SPEED / 1.75,
        keepDistanceToTarget: dockingCandidate.radius + SHIP_RADIUS,
      });
    }

    const enemyShip = closestPoint(ship, gameMap.enemyShips);
    if (enemyShip) {
      return ship.navigate({ target: enemyShip, speed: MAX_SPEED / 1.5 });
    }

    return null;
  });
}
