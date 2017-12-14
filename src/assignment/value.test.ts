import GameMap from 'halite/GameMap';

import Goal from '../goal/goal';
import { goalStub } from '../test/goal';

import generateShipGoalValues from './value';

test('generates a value for each ship-goal combination', () => {
  const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
  gm.addPlayerShips(0, [{ id: 0 }, { id: 1 }, { id: 2 }]);

  const goals: Goal[] = [{ ...goalStub }, { ...goalStub }];

  expect(
    generateShipGoalValues(goals, gm).map(goalValues =>
      goalValues.map(({ goal, ...value }) => ({
        ...value,
        goalIndex: goals.indexOf(goal),
      })),
    ),
  ).toMatchSnapshot();
});

test('considers both value and suitability', () => {
  const gm = new GameMap({ myPlayerId: 0, width: 100, height: 100 });
  gm.addPlayerShips(0, [{ id: 0 }, { id: 1 }, { id: 2 }]);

  const goals: Goal[] = [
    {
      ...goalStub,
      suitability: ({ id }) => [0.1, 0.5, 0.9][id],
    },
    {
      ...goalStub,
      suitability: ({ id }) => [0.3, 0.7, 0.5][id],
    },
  ];

  expect(
    generateShipGoalValues(goals, gm).map(goalValues =>
      goalValues.map(({ goal, ...value }) => ({
        ...value,
        goalIndex: goals.indexOf(goal),
      })),
    ),
  ).toMatchSnapshot();
});
