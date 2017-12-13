import GameMap from 'halite/GameMap';
import { OwnShip } from 'halite/Ship';

import Goal from '../goal/goal';

import distributeShips from './distribution';
import generateShipGoalValues from './value';

export interface ShipGoal<Turn> {
  ship: OwnShip<Turn>;
  goal: Goal<Turn>;
}

const assignGoalsToShips = <Turn>(
  goals: Goal<Turn>[],
  gm: GameMap<Turn>,
): ShipGoal<Turn>[] => {
  const shipGoalValues = generateShipGoalValues(goals, gm);
  const goalsWithShips = distributeShips(shipGoalValues);

  return goalsWithShips.reduce(
    (acc, goalWithShips) => [
      ...acc,
      ...goalWithShips.shipIds.map(shipId => ({
        ship: gm.shipById(shipId),
        goal: goalWithShips.goal,
      })),
    ],
    [] as ShipGoal<Turn>[],
  );
};

export default assignGoalsToShips;
