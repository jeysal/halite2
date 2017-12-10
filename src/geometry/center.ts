import { Point } from 'halite/Geometry';
import { mean, pluck } from 'ramda';

export const center = (points: Point[]): Point => ({
  x: mean(pluck('x', points)),
  y: mean(pluck('y', points)),
});
