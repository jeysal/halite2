import { DBSCAN } from 'density-clustering';
import { Point } from 'halite/Geometry';

export const dbscan = <T extends Point>(
  points: T[],
  epsilon: number,
  minPts: number,
): T[][] =>
  new DBSCAN()
    .run(points.map(point => [point.x, point.y]), epsilon, minPts)
    .map(cluster => cluster.map(i => points[i]));
