import { MAX_SPEED, SHIP_RADIUS } from 'halite/Constants';
import { Action, start } from 'halite/Game';
import GameMap from 'halite/GameMap';

import { closestPoint } from './geometry/distance';
import { closestFreePlanet } from './planet/distance';

start({
  strategy,
  botName: 'jeysal',
  preProcessing: () => {},
});

function strategy<Turn>(
  gameMap: GameMap<Turn>,
): ((string & Action<Turn>) | null)[] {
  return gameMap.myShips.map(ship => {
    const freePlanet = closestFreePlanet(ship, gameMap.planets);
    if (freePlanet) {
      if (ship.canDock(freePlanet)) return ship.dock(freePlanet);
      return ship.navigate({
        target: freePlanet,
        speed: MAX_SPEED / 1.75,
        keepDistanceToTarget: freePlanet.radius + SHIP_RADIUS,
      });
    }

    const enemyShip = closestPoint(ship, gameMap.enemyShips);
    if (enemyShip) {
      return ship.navigate({ target: enemyShip, speed: MAX_SPEED / 1.5 });
    }

    return null;
  });
}
