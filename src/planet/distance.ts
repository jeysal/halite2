import Planet from 'halite/Planet';
import Ship from 'halite/Ship';
import { filter } from 'ramda';

import { closestPoint } from '../geometry/distance';

export const closestDockingCandidate = <Turn, T extends Planet<Turn>>(
  ship: Ship<Turn>,
  planets: T[],
) =>
  closestPoint(
    ship,
    filter(
      planet => !planet.isOwnedByEnemy() && planet.hasDockingSpot(),
      planets,
    ),
  );
