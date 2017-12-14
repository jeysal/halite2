import { OwnShipId } from 'halite/Ship';
import { maxBy, partition } from 'ramda';

import Goal from '../goal/goal';

import { ShipGoalValue } from './value';

export interface GoalWithShips<Turn = number> {
  goal: Goal<Turn>;
  shipIds: (number & OwnShipId<Turn>)[];
}

/**
 * assign each ship to its highest-value goal
 * a goal's maxShips will not be exceeded
 * ships will not be assigned to a goal of value 0
 */
const distributeShipsIgnoringMinima = <Turn>(
  shipGoalValues: ShipGoalValue<Turn>[][],
  baseGoalWithShips: GoalWithShips<Turn>[],
): GoalWithShips<Turn>[] =>
  shipGoalValues.reduce((goalsWithShips, goalValues) => {
    const goalValuesBelowMax = goalValues.filter(goalValue => {
      const entry = goalsWithShips.find(
        goalWithShips => goalWithShips.goal === goalValue.goal,
      );
      return entry && entry.shipIds.length < entry.goal.maxShips();
    });
    if (goalValuesBelowMax.length) {
      const bestVal = goalValuesBelowMax.reduce(maxBy(value => value.val));
      if (bestVal.val > 0)
        // add this ship to the highest-value goal we just determined
        return goalsWithShips.map(
          goalWithShips =>
            goalWithShips.goal === bestVal.goal
              ? {
                  goal: goalWithShips.goal,
                  shipIds: [...goalWithShips.shipIds, bestVal.shipId],
                }
              : goalWithShips,
        );
    }
    // Nothing to do for this ship
    return goalsWithShips;
  }, baseGoalWithShips);

/**
 * create a list of goalsWithShips, each matching up a goal and its ships
 * no ship is matched to more than one goal (but possibly to none)
 */
const distributeShips = <Turn>(
  shipGoalValues: ShipGoalValue<Turn>[][],
): GoalWithShips<Turn>[] => {
  let remainingShipGoalValues = [...shipGoalValues];
  let result: GoalWithShips<Turn>[] = shipGoalValues[0].map(shipGoalValue => ({
    goal: shipGoalValue.goal,
    shipIds: [] as (number & OwnShipId<Turn>)[],
  }));

  let iterations = 0; // sanity counter to avoid infinite loop or bot timeout
  let unsatisfiedGoals: GoalWithShips<Turn>[];
  do {
    result = distributeShipsIgnoringMinima(remainingShipGoalValues, result);

    // kick out goals below minShips
    [result, unsatisfiedGoals] = partition(
      ({ shipIds, goal }) => shipIds.length >= goal.minShips(),
      result,
    );
    // only keep shipGoalValues in the pool if they are not already assigned in the result
    remainingShipGoalValues = shipGoalValues.filter(
      goalValues =>
        !result.some(({ shipIds }) => shipIds.includes(goalValues[0].shipId)),
    );
  } while (unsatisfiedGoals.length && ++iterations <= 16);

  return result;
};
export default distributeShips;
