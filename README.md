## API (subject to change etc)

A bot is created by registering the bot's main function (and a name for logging purposes) with the API. Each turn, that function is provided with a `frame` object and a `team` integer. The objects inside the frame are freshly created each turn.

Each turn, the AI can use various methods in the frame's objects to setup commands, which are automatically executed when the main AI function returns.

The simplest bot is as follows:

```javascript
const new_bot = require("./antikit/bot")
new_bot("do_nothing", (frame, team) => {});
```

## frame props and methods

```javascript

props = {map, rp, units, houses, cities}
// all are arrays; map is a 2d array of cells, accessed as [x][y]

frame.resources(type)               // type == "wood" | "coal" | "uranium" | ""
// returns a list of cells

frame.city_by_id(id)                // id is a string
// returns a city, or undefined

frame.units_by_team(n)              // n == 0 | 1
// returns a list of units

frame.units_at(x, y)                // coordinates
frame.units_at(o)                   // any cell, house, or unit object
// returns a list of units

frame.houses_by_team(n)             // n == 0 | 1
// returns a list of houses

frame.houses_by_city_id(id)         // id is a string
// returns a list of houses

frame.house_at(x, y)                // coordinates
frame.house_at(o)                   // any cell, house, or unit object
// returns a house, or undefined

```

## cell, house, unit (shared) methods

```javascript

o.copy()
// returns a copy of the object for whatever purpose

o.distance(x, y)                    // coordinates
o.distance(o)                       // any cell, house, or unit object
// returns the Manhattan distance

o.choose(arr)                       // array of objects
// returns the closest object in the array, or undefined if length 0

o.cell()
// returns the cell at object o's location

o.house()
// returns the house at object o's location, or undefined

o.units()
// returns a list of units at object o's location

o.naive_direction(x, y)             // coordinates
o.naive_direction(o)                // any cell, house, or unit object
// returns "n", "s", "e", "w" or "c"

o.adjacent_cell(d)                  // d == "n" | "s" | "e" | "w" | "c"
// returns the adjacent cell in the specified direction, or undefined

```

## cell props

```javascript

props = {x, y, type, amount, road}
// type == "wood" | "coal" | "uranium" | ""

```

## house props and methods

```javascript

props = {team, id, x, y, cd}

h.city()
// returns the city of this house

h.needy()
// returns true if the house's city would die from 10 turns of night

h.order_worker()
// orders a worker to be built at this house

h.order_cart()
// orders a cart to be built at this house

h.order_research()
// orders this house to perform research

h.cancel()
// cancels any previously-given order

```

## unit props and methods

```javascript

props = {type, team, id, x, y, cd, wood, coal, uranium}
// type == "worker" | "cart"

u.weight()
// returns this sum of the unit's wood, coal, and uranium

u.order_move(d)                     // d == "n" | "s" | "e" | "w" | "c"
// orders the unit to move in the specified direction

u.order_build()
// orders the unit to build a city

u.order_pillage()
// orders the unit to pillage the road

u.order_transfer(target_id, type, amount)
u.order_transfer(target_object, type, amount)
// orders the unit to transfer resources to the specified unit

u.cancel()
// cancels any previously-given order

```

## city props and methods

```javascript

props = {team, id, fuel, upkeep}

c.needy()
// returns true if the city would die from 10 turns of night

c.houses()
// returns a list of houses in the city

```
