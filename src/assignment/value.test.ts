import { Action } from 'halite/Game';
import GameMap from 'halite/GameMap';

import Goal from '../goal/goal';

import generateShipGoalValues from './value';

const goalStub: Goal = {
  value: () => 0.5,
  minShips: () => 0,
  maxShips: () => 16,
  suitability: () => 0.5,
  strive: () => '' as string & Action,
};

test('generates a value for each ship-goal combination', () => {
  const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
  gm.addPlayerShips(0, [{ id: 0 }, { id: 1 }, { id: 2 }]);

  const goal1: Goal = { ...goalStub };
  const goal2: Goal = { ...goalStub };

  expect(
    generateShipGoalValues([goal1, goal2], gm).map(goalValues =>
      goalValues.map(({ goal, ...value }) => value),
    ),
  ).toMatchSnapshot();
});

test('considers both value and suitability', () => {
  const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
  gm.addPlayerShips(0, [{ id: 0 }, { id: 1 }, { id: 2 }]);

  const goal1: Goal = {
    ...goalStub,
    suitability: ({ id }) => [0.1, 0.5, 0.9][id],
  };
  const goal2: Goal = {
    ...goalStub,
    suitability: ({ id }) => [0.3, 0.7, 0.5][id],
  };

  expect(
    generateShipGoalValues([goal1, goal2], gm).map(goalValues =>
      goalValues.map(({ goal, ...value }) => value),
    ),
  ).toMatchSnapshot();
});
