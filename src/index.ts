import { Action, start } from 'halite/Game';
import GameMap from 'halite/GameMap';

import assignGoalsToShips from './assignment/assignment';
import { determineAttackGoals } from './goal/attack/attack-goal';
import { determineDockGoals } from './goal/dock/dock-goal';

const strategy = <Turn>(
  gm: GameMap<Turn>,
): ((string & Action<Turn>) | null)[] => {
  const goals = [...determineDockGoals(gm), ...determineAttackGoals(gm)];
  const shipsWithGoals = assignGoalsToShips(goals, gm);
  return shipsWithGoals.map(shipWithGoal =>
    shipWithGoal.goal.strive(shipWithGoal.ship),
  );
};

start({
  strategy,
  botName: 'jeysal',
  preProcessing: () => {},
});
