import { Action, start } from 'halite/Game';
import GameMap from 'halite/GameMap';

import assignGoalsToShips from './assignment/assignment';
import { determineAttackGoals } from './goal/attack/attack-goal';
import { determineDockGoals } from './goal/dock/dock-goal';
import { determineEscapeGoals } from './goal/escape/escape-goal';
import { determineProtectGoals } from './goal/protect/protect-goal';

const strategy = <Turn>(
  gm: GameMap<Turn>,
): ((string & Action<Turn>) | null)[] => {
  const goals = [
    ...determineDockGoals(gm),
    ...determineAttackGoals(gm),
    ...determineProtectGoals(gm),
    ...determineEscapeGoals<Turn>(),
  ];
  const shipsWithGoals = assignGoalsToShips(goals, gm);
  return shipsWithGoals.map(shipWithGoal =>
    shipWithGoal.goal.strive(shipWithGoal.ship, gm),
  );
};

start({
  strategy,
  botName: 'jeysal',
  preProcessing: () => {},
});
