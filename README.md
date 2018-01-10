# halite 2 bot

My JavaScript / TypeScript bot for the [Halite 2 programming challenge](https://github.com/HaliteChallenge/Halite-II).

I did not work on it for more than a few weeks and it did not reach a high rank.
Still, there are a few interesting things in this repo, namely the typings I created and the quite nice integration of halite tooling.

# Typings

`typings/halite.d.ts` defines TypeScript typings for the halite JavaScript library.
They  define the basic data types of the game objects, such as
`Planet`, `Ship`, `Point`, `GameMap`, etc.
But they also define "virtual" types, such as
`OwnPlanet`, `PlayerId`, `EnemyPlayerId`, `EnemyShip`, etc.

Those allow for smart type checking that e.g. catches
attempting to dock a ship without checking that it can dock that specific planet (`Dockable`),
or attempting to command an enemy ship.

They also provide type inference, e.g.
`GameMap.myShips` is of type `OwnShip[]`,
`OwnShip.ownerId` is of type `number & OwnPlayerId`,
`Planet.isOwnedByMe()` is of type `this is OwnPlanet<Turn>`,
`OwnPlanet.isOwnedByMe()` is of type `true`,
`GameMap.shipById(EnemyShipId)` is of type `EnemyShip` while
`GameMap.shipById(number)` is of type `Ship | undefined`, etc.

The `Turn` type variable that is present on many types ensures that game objects are not saved outside of the strategy function
and later reused in an unsafe way, because the capture cannot escape the strategy function.
Of course, all these type checks could be annulled by using unsafe things like the `any` type.

Check out the typings file for more, and try to introduce some errors related to these types on purpose and see if TypeScript catches them :)
There is also `src/guards.ts`, which implements some type guards that are "missing" in the standard halite library,
namely `findPlanetById` and `shipBelongsToPlayer` with lots of overloads.

# Building & Running

First, run `yarn` to install the dependencies.
These are some of the scripts defined in the `package.json`:

* `yarn all` - run all checks and build
* `yarn lint` - lint the code
* `yarn typecheck` - typecheck using TSC
* `yarn test` - run tests (interactive)
* `yarn build` - bundle the code (dist folder)
* `yarn start` - let 4 instances of the bot (from dist folder) play against each other
* `yarn view replays/xyz` - view a replay
* `yarn run versions` - build the git revisions specified on the lines of `versions.txt` and let them compete until interrupted
