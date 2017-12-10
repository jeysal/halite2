import GameMap from 'halite/GameMap';
import { distance, Point } from 'halite/Geometry';

export const centerOfMap = (gm: GameMap<any>): Point => ({
  x: gm.width / 2,
  y: gm.height / 2,
});

export const distanceFromCenterOfMap = (
  gm: GameMap<any>,
  point: Point,
): number => distance(point, centerOfMap(gm));

export const diameter = (gm: GameMap<any>): number =>
  distance({ x: 0, y: 0 }, { x: gm.width, y: gm.height });
