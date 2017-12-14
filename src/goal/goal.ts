import { Action } from 'halite/Game';
import GameMap from 'halite/GameMap';
import { OwnShip } from 'halite/Ship';

export default interface Goal<Turn = number> {
  value(gm: GameMap<Turn>): number;
  minShips(): number;
  maxShips(): number;
  suitability(ship: OwnShip<Turn>, gm: GameMap<Turn>): number;
  strive(ship: OwnShip<Turn>, gm: GameMap<Turn>): string & Action<Turn>;
};
