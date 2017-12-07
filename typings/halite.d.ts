declare module 'halite/Constants' {
  export const MAX_SPEED: 7;
  export const SHIP_RADIUS: 0.5;

  export const MAX_SHIP_HEALTH: 255;
  export const BASE_SHIP_HEALTH: 255;

  export const WEAPON_COOLDOWN: 1;
  export const WEAPON_RADIUS: 5.0;
  export const WEAPON_DAMAGE: 64;
  export const EXPLOSION_RADIUS: 10.0;

  export const DOCK_RADIUS: 4.0;
  export const DOCK_TURNS: 5;

  export const BASE_PRODUCTIVITY: 6;
  export const SPAWN_RADIUS: 2.0;
}

declare module 'halite/DockingStatus' {
  enum DockingStatus {
    UNDOCKED = 0,
    DOCKING = 1,
    DOCKED = 2,
    UNDOCKING = 3,
  }

  export default DockingStatus;
}

declare module 'halite/Entity' {
  import { Circle } from 'halite/Geometry';

  export default abstract class Entity<Turn = number> implements Circle {
    readonly x: number;
    readonly y: number;

    readonly radius: number;

    readonly id: number;
    readonly health: number;

    constructor(params: any);

    distanceBetween(target: Entity<any>): number;

    angleBetweenInDegree(target: Entity<any>): number;
  }
}

declare module 'halite/Game' {
  import GameMap from 'halite/GameMap';

  export interface Action<Turn = number> {
    $$action: Turn;
  }

  interface GameOptions {
    botName: string;
    preProcessing?: (map: GameMap<-1>) => void;
    strategy: <Turn>(map: GameMap<Turn>) => ((string & Action<Turn>) | null)[];
  }

  export function start(options: GameOptions): void;
}

declare module 'halite/GameMap' {
  import Entity from 'halite/Entity';
  import Planet from 'halite/Planet';
  import Ship, {
    EnemyShip,
    OwnShip,
    ShipId,
    EnemyShipId,
    OwnShipId,
  } from 'halite/Ship';

  export interface PlayerId {
    $$playerId;
  }

  export interface EnemyPlayerId extends PlayerId {
    $$enemyPlayerId;
  }

  export interface OwnPlayerId extends PlayerId {
    $$ownPlayerId;
  }

  export default class GameMap<Turn = -1> {
    constructor(params: GameMapParams);

    readonly width: number;
    readonly height: number;

    readonly numberOfPlayers: number;
    readonly myPlayerId: number & OwnPlayerId;

    readonly allShips: Ship<Turn>[];
    readonly enemyShips: EnemyShip<Turn>[];
    readonly myShips: OwnShip<Turn>[];

    readonly planets: Planet<Turn>[];

    playerShips(playerId: number & EnemyPlayerId): EnemyShip<Turn>[];
    playerShips(playerId: number & OwnPlayerId): OwnShip<Turn>[];
    playerShips(playerId: number): Ship<Turn>[];

    shipById(shipId: number & EnemyShipId<Turn>): EnemyShip<Turn>;
    shipById(shipId: number & OwnShipId<Turn>): OwnShip<Turn>;
    shipById(shipId: number & ShipId<Turn>): Ship<Turn>;
    shipById(shipId: number & EnemyShipId<any>): EnemyShip<Turn> | undefined;
    shipById(shipId: number & OwnShipId<any>): OwnShip<Turn> | undefined;
    shipById(shipId: number): Ship<Turn> | undefined;

    shipsByIds(ids: (number & EnemyShipId<any>)[]): EnemyShip<Turn>[];
    shipsByIds(ids: (number & OwnShipId<any>)[]): OwnShip<Turn>[];
    shipsByIds(ids: number[]): Ship<Turn>;

    shipsBetween(start: Entity<Turn>, end: Entity<Turn>): Ship<Turn>[];
    enemyShipsBetween(
      start: Entity<Turn>,
      end: Entity<Turn>,
    ): EnemyShip<Turn>[];
    ownShipBetween(start: Entity<Turn>, end: Entity<Turn>): OwnShip<Turn>[];

    planetsBetween(start: Entity<Turn>, end: Entity<Turn>): Planet<Turn>[];

    obstaclesBetween(
      start: Entity<Turn>,
      end: Entity<Turn>,
    ): (Ship<Turn> | Planet<Turn>)[];

    addPlayerId(playerId: number): void;
    addPlayerShips(playerId: number, shipsParams: object[]): void;
    addPlanets(planetParams: object[]): void;
  }

  export interface GameMapParams {
    myPlayerId: number;
    width: number;
    height: number;
  }
}

declare module 'halite/GameMapParser' {
  import GameMap, { GameMapParams } from 'halite/GameMap';

  export default class GameMapParser {
    constructor(params: GameMapParams);

    parse(line: string): GameMap;
  }
}

declare module 'halite/Geometry' {
  export interface Point {
    readonly x: number;
    readonly y: number;
  }

  export interface Circle extends Point {
    readonly radius: number;
  }

  export function distance(start: Point, end: Point): number;

  export function angleInRad(start: Point, end: Point): number;
  export function angleInDegree(start: Point, end: Point): number;

  export function rotateEnd(
    start: Point,
    end: Point,
    degreeDelta: number,
  ): Point;
  export function reduceEnd(start: Point, end: Point, delta: number): Point;

  export function toDegree(rad: number): number;
  export function toRad(degree: number): number;

  export function intersectSegmentCircle(
    start: Point,
    end: Point,
    circle: Circle,
    fudge: number,
  ): boolean;
}

declare module 'halite/Log' {
  import { PathLike } from 'fs';

  export function init(filePath: PathLike): void;
  export function log(line: any): void;
}

declare module 'halite/Networking' {
  export function writeLine(line: string): void;
  export function sendMoves(moves: string[]): void;
  export function readNLines(n: number, callback: (lines: string[]) => void);
  export function readLine(callback: (line: string) => void);
  export function forEachReadLine(callback: (line: string) => void);
}

declare module 'halite/Planet' {
  import Entity from 'halite/Entity';
  import GameMap, {
    PlayerId,
    EnemyPlayerId,
    OwnPlayerId,
  } from 'halite/GameMap';
  import Ship, {
    EnemyShip,
    OwnShip,
    ShipId,
    EnemyShipId,
    OwnShipId,
  } from 'halite/Ship';

  export interface PlanetId<Turn = number> {
    $$planetId: Turn;
  }

  export interface EnemyPlanetId<Turn = number> extends PlanetId<Turn> {
    $$enemyPlanetId: Turn;
  }

  export interface OwnPlanetId<Turn = number> extends PlanetId<Turn> {
    $$ownPlanetId: Turn;
  }

  export default class Planet<Turn = number> extends Entity<Turn> {
    readonly id: number & PlanetId<Turn>;
    readonly ownerId?: number & PlayerId;

    readonly dockingSpots: number;
    readonly numberOfDockedShips: number;

    readonly dockedShipIds: (number & ShipId<Turn>)[];
    readonly dockedShips: Ship<Turn>[];

    readonly currentProduction: number;

    constructor(gameMap: GameMap, params: any);

    isOwned(): this is EnemyPlanet<Turn> | OwnPlanet<Turn>;
    isOwnedByMe(): this is OwnPlanet<Turn>;
    isOwnedByEnemy(): this is EnemyPlanet<Turn>;
    isFree(): boolean;

    hasDockingSpot(): boolean;

    toString(): string;
  }

  export class Dockable<
    DockingShip extends Ship<Turn>,
    Turn = number
  > extends Planet<Turn> {
    hasDockingSpot(): true;
  }

  export class EnemyPlanet<Turn = number> extends Planet<Turn> {
    readonly id: number & EnemyPlanetId<Turn>;
    readonly ownerId: number & EnemyPlayerId;

    readonly dockedShipIds: (number & EnemyShipId<Turn>)[];
    readonly dockedShips: EnemyShip<Turn>[];

    isOwned(): true;
    isOwnedByEnemy(): true;
    isOwnedByMe(): false;
    isFree(): false;
  }

  export class OwnPlanet<Turn = number> extends Planet<Turn> {
    readonly id: number & OwnPlanetId<Turn>;
    readonly ownerId: number & OwnPlayerId;

    readonly dockedShipIds: (number & OwnShipId<Turn>)[];
    readonly dockedShips: OwnShip<Turn>[];

    isOwned(): true;
    isOwnedByEnemy(): false;
    isOwnedByMe(): true;
    isFree(): false;
  }

  export class FreePlanet<Turn = number> extends Planet<Turn> {
    readonly id: number & FreePlanetId<Turn>;
    readonly ownerId: null;

    readonly numberOfDockedShips: 0;

    readonly dockedShipIds: never[];
    readonly dockedShips: never[];

    isOwned(): false;
    isOwnedByEnemy(): false;
    isOwnedByMe(): false;
    isFree(): true;

    hasDockingSpot(): true;
  }
}

declare module 'halite/Ship' {
  import DockingStatus from 'halite/DockingStatus';
  import Entity from 'halite/Entity';
  import { Action } from 'halite/Game';
  import GameMap, {
    PlayerId,
    EnemyPlayerId,
    OwnPlayerId,
  } from 'halite/GameMap';
  import { Point } from 'halite/Geometry';
  import Planet, {
    Dockable,
    FreePlanet,
    EnemyPlanet,
    OwnPlanet,
    PlanetId,
    EnemyPlanetId,
    OwnPlanetId,
  } from 'halite/Planet';

  export interface ShipId<Turn = number> {
    $$shipId: Turn;
  }

  export interface EnemyShipId<Turn = number> extends ShipId<Turn> {
    $$enemyShipId: Turn;
  }

  export interface OwnShipId<Turn = number> extends ShipId<Turn> {
    $$ownShipId: Turn;
  }

  export default class Ship<Turn = number> extends Entity<Turn> {
    readonly id: number & ShipId<Turn>;
    readonly ownerId: number & PlayerId;

    readonly dockingStatus: DockingStatus;
    readonly dockingProgress: number;
    readonly dockedPlanetId: PlanetId<Turn>;

    readonly weaponCooldown: number;

    constructor(gameMap: GameMap, ownerId: number, params: object);

    isDocked(): boolean;
    isUndocked(): boolean;
    isDocking(): boolean;
    isUndocking(): boolean;

    pointApproaching(target: Point, delta: number): Point;

    canDock(planet: Planet<Turn>): planet is Dockable<this, Turn>;

    toString(): string;
  }

  export class EnemyShip<Turn = number> extends Ship<Turn> {
    readonly id: number & EnemyShipId<Turn>;
    readonly ownerId: number & EnemyPlayerId;

    readonly dockedPlanetId: EnemyPlanetId<Turn>;

    canDock(planet: OwnPlanet<Turn>): false;
    canDock(planet: Planet<Turn>): planet is Dockable<this, Turn>;
  }

  export class OwnShip<Turn = number> extends Ship<Turn> {
    readonly id: number & OwnShipId<Turn>;
    readonly ownerId: number & OwnPlayerId;

    readonly dockedPlanetId: OwnPlanetId<Turn>;

    canDock(planet: EnemyPlanet<Turn>): false;
    canDock(planet: Planet<Turn>): planet is Dockable<this, Turn>;

    dock(planet: Dockable<this, Turn>): string & Action<Turn>;
    unDock(): string & Action<Turn>;

    thrust(magnitude: number, angle: number): string & Action<Turn>;
    navigate(navigation: {
      target: Entity<Turn>;
      keepDistanceToTarget?: number;
      speed: number;
      avoidObstacles?: boolean;
      maxCorrections?: number;
      angularStep?: number;
      ignoreShips?: boolean;
      ignorePlanets?: boolean;
    }): string & Action<Turn>;
  }
}
