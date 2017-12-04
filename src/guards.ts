/*
 This file contains type guard helpers that are useful mostly for figuring out ownership relations.
*/

import { EnemyPlayerId, OwnPlayerId, PlayerId } from 'halite/GameMap';
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
