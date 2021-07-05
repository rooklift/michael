## API (subject to change etc)

The program starts in `main.js` but each turn it calls the AI in `ai.js` and provides it with a `frame` object and a `team` integer.

Each turn, the AI can use various methods in the frame's objects to setup commands, then finally call `frame.send_orders()`.

## frame methods

```javascript

frame.resources(type)               // type == "wood" | "coal" | "uranium"
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

o.distance(x, y)                    // coordinates
o.distance(o)                       // any cell, house, or unit object
// returns the Manhattan distance

o.cell()
// returns the cell at object o's location

o.house()
// returns the house at object o's location, or undefined

o.units()
// returns a list of units at object o's location

o.nearest_resource(type)            // type == "wood" | "coal" | "uranium"
// returns the nearest cell with the specified resource, or undefined

o.nearest_house(n)                  // n == 0 | 1
// returns the nearest house of team n, or undefined

o.nearest_needy_house(n)            // n == 0 | 1
// returns the nearest house of team n which would not survive 10 turns of night, or undefined

o.nearest_unit(n)                   // n == 0 | 1
// returns the nearest unit of team n, or undefined

o.naive_direction(x, y)             // coordinates
o.naive_direction(o)                // any cell, house, or unit object
// returns "n", "s", "e", "w" or "c"

o.adjacent_cell(d)                  // d == "n" | "s" | "e" | "w" | "c"
// returns the adjacent cell in the specified direction, or undefined

```

## cell props

```javascript

props = {x, y, type, amount, road} 
// type == "wood" | "coal" | "uranium"

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
// cancel any previously-given order

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
// cancel any previously-given order

```

## city props and methods

```javascript

props = {team, id, fuel, upkeep}

c.needy()
// returns true if the city would die from 10 turns of night

c.houses()
// returns a list of houses in the city

```
