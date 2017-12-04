import { Point } from 'halite/Geometry';
import Planet from 'halite/Planet';
import { filter } from 'ramda';

import { closestPoint } from '../geometry/distance';

export const closestFreePlanet = <Turn, T extends Planet<Turn>>(
  base: Point,
  planets: T[],
) => closestPoint(base, filter(planet => planet.isFree(), planets));
