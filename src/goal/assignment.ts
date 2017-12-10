import GameMap from 'halite/GameMap';
import { OwnShip } from 'halite/Ship';
import { maxBy } from 'ramda';

import Goal from '../goal/goal';

interface ShipGoal<Turn> {
  ship: OwnShip<Turn>;
  goal: Goal<Turn>;
}

const VALUE_IMPACT = 0.5;
const SUITABILITY_IMPACT = 0.5;

const shipGoalValue = <Turn>(
  ship: OwnShip<Turn>,
  goal: Goal<Turn>,
  gm: GameMap<Turn>,
): number =>
  VALUE_IMPACT * goal.value(gm) +
  SUITABILITY_IMPACT * goal.suitability(ship, gm);

const assignGoalsToShips = <Turn>(
  goals: Goal<Turn>[],
  gm: GameMap<Turn>,
): ShipGoal<Turn>[] => {
  const ownShips = gm.myShips;

  const shipGoalValues = ownShips.map(ship =>
    goals.map(goal => ({ ship, goal, val: shipGoalValue(ship, goal, gm) })),
  );

  const goalsWithShips = shipGoalValues.reduce((gwss, gVals) => {
    const gValsBelowLimit = gVals.filter(gVal => {
      const entry = gwss.find(gws => gws.goal === gVal.goal);
      return !entry || entry.ships.length < entry.goal.maxShips();
    });
    if (gValsBelowLimit.length) {
      const bestVal = gValsBelowLimit.reduce(maxBy(value => value.val));
      return gwss.map(
        goalWithShips =>
          bestVal && goalWithShips.goal === bestVal.goal
            ? {
                goal: goalWithShips.goal,
                ships: [...goalWithShips.ships, bestVal.ship],
              }
            : goalWithShips,
      );
    }
    return gwss;
  }, goals.map(goal => ({ goal, ships: [] as OwnShip<Turn>[] })));

  // TODO goal minima

  return goalsWithShips.reduce(
    (acc, gws) => [
      ...acc,
      ...gws.ships.map(ship => ({ ship, goal: gws.goal })),
    ],
    [] as ShipGoal<Turn>[],
  );
};

export default assignGoalsToShips;
