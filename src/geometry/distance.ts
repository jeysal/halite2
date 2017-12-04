import { distance, Point } from 'halite/Geometry';
import { head, sortBy } from 'ramda';

export const closestPoint = <T extends Point>(origin: Point, points: T[]) =>
  head(sortBy(point => distance(origin, point), points));
