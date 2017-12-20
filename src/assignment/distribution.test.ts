import Goal from '../goal/goal';
import { goalStub } from '../test/goal';

import distributeShips from './distribution';
import { ShipGoalValue } from './value';

test('matches up the ships with their highest-value goals', () => {
  const goals: Goal[] = [{ ...goalStub }, { ...goalStub }, { ...goalStub }];

  expect(
    distributeShips([
      [
        { goal: goals[0], shipId: 0, val: 0.1 },
        { goal: goals[1], shipId: 0, val: 0.2 },
        { goal: goals[2], shipId: 0, val: 0.7 },
      ],
      [
        { goal: goals[0], shipId: 1, val: 0.6 },
        { goal: goals[1], shipId: 1, val: 0.5 },
        { goal: goals[2], shipId: 1, val: 0.4 },
      ],
      [
        { goal: goals[0], shipId: 2, val: 0.4 },
        { goal: goals[1], shipId: 2, val: 0.5 },
        { goal: goals[2], shipId: 2, val: 0.5 },
      ],
      [
        { goal: goals[0], shipId: 3, val: 0.1 },
        { goal: goals[1], shipId: 3, val: 0.2 },
        { goal: goals[2], shipId: 3, val: 0.3 },
      ],
    ] as ShipGoalValue[][]).map(({ goal, shipIds }) => ({
      shipIds,
      goalIndex: goals.indexOf(goal),
    })),
  ).toMatchSnapshot();
});

test('matches up a single ship with its highest-value goal', () => {
  const goals: Goal[] = [{ ...goalStub }, { ...goalStub }, { ...goalStub }];

  expect(
    distributeShips([
      [
        { goal: goals[0], shipId: 0, val: 0.1 },
        { goal: goals[1], shipId: 0, val: 0.2 },
        { goal: goals[2], shipId: 0, val: 0.7 },
      ],
    ] as ShipGoalValue[][]).map(({ goal, shipIds }) => ({
      shipIds,
      goalIndex: goals.indexOf(goal),
    })),
  ).toMatchSnapshot();
});

test('does not match a ship that has value zero everywhere', () => {
  const goals: Goal[] = [{ ...goalStub }, { ...goalStub }];

  expect(
    distributeShips([
      [
        { goal: goals[0], shipId: 0, val: 0.5 },
        { goal: goals[1], shipId: 0, val: 0.5 },
      ],
      [
        { goal: goals[0], shipId: 1, val: 0 },
        { goal: goals[1], shipId: 1, val: 0 },
      ],
    ] as ShipGoalValue[][]).map(({ goal, shipIds }) => ({
      shipIds,
      goalIndex: goals.indexOf(goal),
    })),
  ).toMatchSnapshot();
});

test('matches a ship to another goal to avoid exceeding maxShips', () => {
  const goals: Goal[] = [
    { ...goalStub },
    { ...goalStub },
    { ...goalStub, maxShips: () => 2 },
  ];

  expect(
    distributeShips([
      [
        { goal: goals[0], shipId: 0, val: 0.4 },
        { goal: goals[1], shipId: 0, val: 0.4 },
        { goal: goals[2], shipId: 0, val: 0.5 },
      ],
      [
        { goal: goals[0], shipId: 1, val: 0.4 },
        { goal: goals[1], shipId: 1, val: 0.4 },
        { goal: goals[2], shipId: 1, val: 0.5 },
      ],
      [
        { goal: goals[0], shipId: 2, val: 0.4 },
        { goal: goals[1], shipId: 2, val: 0.4 },
        { goal: goals[2], shipId: 2, val: 0.5 },
      ],
    ] as ShipGoalValue[][]).map(({ goal, shipIds }) => ({
      shipIds,
      goalIndex: goals.indexOf(goal),
    })),
  ).toMatchSnapshot();
});

test('does not match a ship if all goals are at capacity', () => {
  const goals: Goal[] = [
    { ...goalStub, maxShips: () => 1 },
    { ...goalStub, maxShips: () => 1 },
  ];

  expect(
    distributeShips([
      [
        { goal: goals[0], shipId: 0, val: 0.5 },
        { goal: goals[1], shipId: 0, val: 0.5 },
      ],
      [
        { goal: goals[0], shipId: 1, val: 0.5 },
        { goal: goals[1], shipId: 1, val: 0.5 },
      ],
      [
        { goal: goals[0], shipId: 2, val: 0.5 },
        { goal: goals[1], shipId: 2, val: 0.5 },
      ],
    ] as ShipGoalValue[][]).map(({ goal, shipIds }) => ({
      shipIds,
      goalIndex: goals.indexOf(goal),
    })),
  ).toMatchSnapshot();
});

test('matches a ship to another goal to avoid undershooting minShips', () => {
  const goals: Goal[] = [
    { ...goalStub, minShips: () => 1 },
    { ...goalStub, minShips: () => 1 },
    { ...goalStub, minShips: () => 3 },
  ];

  expect(
    distributeShips([
      [
        { goal: goals[0], shipId: 0, val: 1 },
        { goal: goals[1], shipId: 0, val: 0 },
        { goal: goals[2], shipId: 0, val: 0 },
      ],
      [
        { goal: goals[0], shipId: 1, val: 0 },
        { goal: goals[1], shipId: 1, val: 0.3 },
        { goal: goals[2], shipId: 1, val: 0.7 },
      ],
      [
        { goal: goals[0], shipId: 2, val: 0 },
        { goal: goals[1], shipId: 2, val: 0.3 },
        { goal: goals[2], shipId: 2, val: 0.7 },
      ],
    ] as ShipGoalValue[][]).map(({ goal, shipIds }) => ({
      shipIds,
      goalIndex: goals.indexOf(goal),
    })),
  ).toMatchSnapshot();
});

test('prefers an empty array over violating minShips if the heuristic fails', () => {
  const goals: Goal[] = [
    { ...goalStub, minShips: () => 12 },
    { ...goalStub, minShips: () => 12 },
    { ...goalStub, minShips: () => 12 },
  ];

  expect(
    distributeShips(Array(15)
      .fill(0)
      .map((_, i) => [
        { goal: goals[0], shipId: i, val: i % 3 === 0 ? 0.9 : 0.1 },
        { goal: goals[1], shipId: i, val: i % 3 === 1 ? 0.9 : 0.1 },
        { goal: goals[2], shipId: i, val: i % 3 === 2 ? 0.9 : 0.1 },
      ]) as ShipGoalValue[][]).map(({ goal, shipIds }) => ({
      shipIds,
      goalIndex: goals.indexOf(goal),
    })),
  ).toMatchSnapshot();
});
