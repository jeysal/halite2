import { OwnShipId } from 'halite/Ship';
import { maxBy, reduce, sortBy, sum, tail } from 'ramda';

import Goal from '../goal/goal';

import { ShipGoalValue } from './value';

interface Distribution<Turn = number> {
  goalsWithShips: GoalWithShips<Turn>[];
  totalValue: number;
}

/**
 * Recursively calculate the best distribution.
 * Computational complexity is exponential (n^m with shipGoalValues of size [m][n]),
 * but both m and n can be limited by applying heuristics, controlled by the optional parameters.
 * Note that the worst case of this heuristic is an empty array in spite of the existence of a distribution with positive total value.
 * It may be useful to check the return value for an empty array and retry with different limits.
 * @param recursionBranchLimit How many of the heuristically best goals to recurse into per ship.
 *                             A higher value results in a potentially better distribution but also increases computation time.
 *                             This limits n (the base) of algorithmic complexity.
 * @param recursionDepthLimit How far from the last ship to start branching.
 *                            Only after this point, recursionBranchLimit will actually have any effect.
 *                            Prior to this point, recursionBranchLimit is effectively 1.
 *                            This limits m (the exponent) of algorithmic complexity.
 *                            For a meaningful heuristic, shipGoalValues should be sorted
 *                            (e.g. moving ships with a single prominently high goal value to the beginning of the array).
 */
const recurseValues = <Turn>(
  { goalsWithShips, totalValue }: Distribution<Turn>,
  shipGoalValues: ShipGoalValue<Turn>[][],
  recursionBranchLimit: number,
  recursionDepthLimit: number,
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
  // ignore this ship, continue with the next
  if (!usableGoalValues.length)
    return recurseValues(
      { goalsWithShips, totalValue },
      tail(shipGoalValues),
      recursionBranchLimit,
      recursionDepthLimit,
    );

  const heuristicallyBestGoalValues = sortBy(
    ({ val }) => val,
    usableGoalValues,
  ).slice(
    -(shipGoalValues.length <= recursionDepthLimit ? recursionBranchLimit : 1),
  );

  // recursively calculated best distribution for each usable goal
  const completeGoalValues = heuristicallyBestGoalValues.map(
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
        recursionBranchLimit,
        recursionDepthLimit,
      );
    },
  );

  return reduce(
    maxBy(({ totalValue }) => totalValue),
    { goalsWithShips: [], totalValue: 0 },
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
  const shipGoalValuesByTopGoalProminenceDesc = sortBy(goalValues => {
    const sortedGoalValues = sortBy(({ val }) => -val, goalValues);
    return sortedGoalValues[1].val - sortedGoalValues[0].val; // descending prominence
  }, shipGoalValues);

  const { goalsWithShips } = recurseValues(
    { goalsWithShips: [], totalValue: 0 },
    shipGoalValuesByTopGoalProminenceDesc,
    3,
    8,
  );

  return goalsWithShips;
};
export default distributeShips;
