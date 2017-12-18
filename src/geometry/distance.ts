import { distance, Point } from 'halite/Geometry';
import { head, min, sortBy } from 'ramda';

export const closestPoint = <T extends Point>(origin: Point, points: T[]) =>
  head(sortBy(point => distance(origin, point), points));

export const closestDistance = (
  origin: Point,
  points: Point[],
  maxDistance: number = Number.POSITIVE_INFINITY,
) => points.map(point => distance(origin, point)).reduce(min, maxDistance);
