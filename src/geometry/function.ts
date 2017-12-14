import cubicSpline from 'cubic-spline';

export const interpolate = (...knots: number[][]) => (point: number): number =>
  cubicSpline(point, knots.map(([x]) => x), knots.map(([_, y]) => y));
