import { OwnShipId } from 'halite/Ship';
import { maxBy } from 'ramda';

import Goal from '../goal/goal';

import { ShipGoalValue } from './value';

export interface GoalWithShips<Turn = number> {
  goal: Goal<Turn>;
  shipIds: (number & OwnShipId<Turn>)[];
}

/**
 * create a list of goalsWithShips, each matching up a goal and its ships
 * no ship is matched to more than one goal (but possibly to none)
 * TODO goal minima
 */
const distributeShips = <Turn>(
  shipGoalValues: ShipGoalValue<Turn>[][],
): GoalWithShips<Turn>[] =>
  shipGoalValues.reduce((goalsWithShips, goalValues) => {
    const goalValuesBelowMax = goalValues.filter(goalValue => {
      const entry = goalsWithShips.find(
        goalWithShips => goalWithShips.goal === goalValue.goal,
      );
      return !entry || entry.shipIds.length < entry.goal.maxShips();
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
  }, shipGoalValues[0].map(shipGoalValue => ({ goal: shipGoalValue.goal, shipIds: [] as (number & OwnShipId<Turn>)[] })));

export default distributeShips;
