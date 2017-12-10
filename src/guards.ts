/*
 This file contains type guard helpers that are useful mostly for figuring out ownership relations.
*/

import GameMap, { EnemyPlayerId, OwnPlayerId, PlayerId } from 'halite/GameMap';
import Planet, {
  EnemyPlanet,
  EnemyPlanetId,
  OwnPlanet,
  OwnPlanetId,
  PlanetId,
} from 'halite/Planet';
import Ship, { EnemyShip, OwnShip } from 'halite/Ship';

export function shipBelongsToPlayer<Turn>(
  ship: EnemyShip<Turn>,
  playerId: number & PlayerId,
): playerId is number & EnemyPlayerId;
export function shipBelongsToPlayer<Turn>(
  ship: EnemyShip<Turn>,
  playerId: number & OwnPlayerId,
): false;
export function shipBelongsToPlayer<Turn>(
  ship: EnemyShip<Turn>,
  playerId: number & EnemyPlayerId,
): true;
export function shipBelongsToPlayer<Turn>(
  ship: OwnShip<Turn>,
  playerId: number & PlayerId,
): playerId is number & OwnPlayerId;
export function shipBelongsToPlayer<Turn>(
  ship: OwnShip<Turn>,
  playerId: number & EnemyPlayerId,
): false;
export function shipBelongsToPlayer<Turn>(
  ship: OwnShip<Turn>,
  playerId: number & OwnPlayerId,
): true;
export function shipBelongsToPlayer<Turn>(
  ship: Ship<Turn>,
  playerId: number & EnemyPlayerId,
): ship is EnemyShip<Turn>;
export function shipBelongsToPlayer<Turn>(
  ship: Ship<Turn>,
  playerId: number & OwnPlayerId,
): ship is OwnShip<Turn>;
export function shipBelongsToPlayer<Turn>(
  ship: Ship<Turn>,
  playerId: number & PlayerId,
): boolean {
  return ship.ownerId === playerId;
}

export function findPlanetById<Turn>(
  planetId: number & EnemyPlanetId<Turn>,
  gameMap: GameMap<Turn>,
): EnemyPlanet<Turn>;
export function findPlanetById<Turn>(
  planetId: number & OwnPlanetId<Turn>,
  gameMap: GameMap<Turn>,
): OwnPlanet<Turn>;
export function findPlanetById<Turn>(
  planetId: number & PlanetId<Turn>,
  gameMap: GameMap<Turn>,
): Planet<Turn>;
export function findPlanetById<Turn>(
  planetId: number,
  gameMap: GameMap<Turn>,
): Planet<Turn> | undefined {
  return gameMap.planets.find(planet => planet.id === planetId);
}
