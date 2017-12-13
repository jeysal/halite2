import GameMap from 'halite/GameMap';
import { OwnShip } from 'halite/Ship';

import Goal from '../goal/goal';

const VALUE_IMPACT = 0.5;
const SUITABILITY_IMPACT = 0.5;

export interface ShipGoalValue<Turn> {
  ship: OwnShip<Turn>;
  goal: Goal<Turn>;
  val: number;
}

const calcShipGoalValue = <Turn>(
  ship: OwnShip<Turn>,
  goal: Goal<Turn>,
  gm: GameMap<Turn>,
): ShipGoalValue<Turn> => ({
  ship,
  goal,
  val:
    VALUE_IMPACT * goal.value(gm) +
    SUITABILITY_IMPACT * goal.suitability(ship, gm),
});

/**
 * generates a 2D matrix of ship-goal values with suitability taken into account
 */
const generateShipGoalValues = <Turn>(
  goals: Goal<Turn>[],
  gm: GameMap<Turn>,
): ShipGoalValue<Turn>[][] =>
  gm.myShips.map(ship => goals.map(goal => calcShipGoalValue(ship, goal, gm)));

export default generateShipGoalValues;
