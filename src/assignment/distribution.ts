import { OwnShipId } from 'halite/Ship';
import { maxBy, reduce, sum, tail } from 'ramda';

import Goal from '../goal/goal';

import { ShipGoalValue } from './value';

interface Distribution<Turn = number> {
  goalsWithShips: GoalWithShips<Turn>[];
  totalValue: number;
}

const recurseValues = <Turn>(
  { goalsWithShips, totalValue }: Distribution<Turn>,
  shipGoalValues: ShipGoalValue<Turn>[][],
): Distribution<Turn> => {
  // fail if goals have been picked too broadly
  const missingShips = sum(
    goalsWithShips.map(({ goal, shipIds }) =>
      Math.max(goal.minShips() - shipIds.length, 0),
    ),
  );
  if (shipGoalValues.length < missingShips)
    return { goalsWithShips, totalValue: Number.NEGATIVE_INFINITY };

  // we're done with this path
  if (!shipGoalValues.length) return { goalsWithShips, totalValue };

  const currentGoalValues = shipGoalValues[0];
  // goals with capacity and value > 0 for this ship
  const usableGoalValues = currentGoalValues.filter(
    ({ val, goal: potentialGoal }) =>
      val > 0 &&
      goalsWithShips.every(
        ({ shipIds, goal: distributedGoal }) =>
          distributedGoal !== potentialGoal ||
          distributedGoal.maxShips() > shipIds.length,
      ),
  );

  // recursively calculated best distribution for each usable goal
  const completeGoalValues = usableGoalValues.map(
    ({
      goal: augmentedGoal,
      shipId: augmentingShipId,
      val: augmentationValue,
    }) => {
      const augmentedGoalsWithShips = goalsWithShips
        .map(({ goal }) => goal)
        .includes(augmentedGoal)
        ? // add shipId to existing goalsWithShips entry
          goalsWithShips.map(({ goal, shipIds }) => ({
            goal,
            shipIds:
              goal === augmentedGoal ? [...shipIds, augmentingShipId] : shipIds,
          }))
        : // add new goalsWithShips entry
          [
            ...goalsWithShips,
            { goal: augmentedGoal, shipIds: [augmentingShipId] },
          ];

      return recurseValues(
        {
          goalsWithShips: augmentedGoalsWithShips,
          totalValue: totalValue + augmentationValue,
        },
        tail(shipGoalValues),
      );
    },
  );

  return reduce(
    maxBy(({ totalValue }) => totalValue),
    { goalsWithShips, totalValue },
    completeGoalValues,
  );
};

export interface GoalWithShips<Turn = number> {
  goal: Goal<Turn>;
  shipIds: (number & OwnShipId<Turn>)[];
}

/**
 * create a list of goalsWithShips, each matching up a goal and its ships
 * no ship is matched to more than one goal (but possibly to none)
 */
const distributeShips = <Turn>(
  shipGoalValues: ShipGoalValue<Turn>[][],
): GoalWithShips<Turn>[] => {
  return recurseValues({ goalsWithShips: [], totalValue: 0 }, shipGoalValues)
    .goalsWithShips;
};
export default distributeShips;
