import { Action } from 'halite/Game';
import GameMap from 'halite/GameMap';
import Ship, { OwnShip } from 'halite/Ship';

import Goal from '../goal/goal';

export const goalStub: Goal = {
  value: () => 0.5,
  minShips: () => 0,
  maxShips: () => 16,
  suitability: () => 0.5,
  strive: () => '' as string & Action,
};

export const goalStats = <Turn>(
  goal: Goal<Turn>,
  ship: Ship<Turn>,
  gm: GameMap<Turn>,
): object => ({
  value: goal.value(gm),
  minShips: goal.minShips(),
  maxShips: goal.maxShips(),
  suitability: goal.suitability(ship as OwnShip<Turn>, gm),
  action: goal.strive(ship as OwnShip<Turn>),
});
