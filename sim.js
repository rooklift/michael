"use strict";

// Given a list of orders and a frame, need to generate a scorable object,
// with the correct next-frame locations containing sim units with cargo.
//
//
// From Lux comments:
//
// iterate through all moves and store a mapping from cell to the actions that will cause a unit to move there
//
// for each cell that has multiple mapped to actions, we remove all actions as that cell is a "bump" cell
// where no units can get there because they all bumped into each other
//
// for all removed actions for that particular cell, find the cell the unit that wants to execute the action is
// currently at, labeled `origcell`. Revert these removed actions by first getting all the actions mapped from
// `origcell` and then deleting that mapping, and then recursively reverting the actions mapped from `origcell`

function new_move(x1, y1, x2, y2) {
	return {
		x1,
		y1,
		x2,
		y2,
		ss: `${x1}|${y1}`,			// source as a string
		ts: `${x2}|${y2}`,			// target as a string
	};
}

function resolve(frame, team, moveslist) {

	// Note that every friendly unit should be in the moveslist; units with cooldown should be given as stationary.

	let my_houses = frame.houses_by_team(team);
	let opp_houses = frame.houses_by_team((team + 1) % 2);

	let my_houses_locs = Object.create(null);
	let opp_houses_locs = Object.create(null);

	for (let house of my_houses) {
		let key = `${house.x}|${house.y}`;
		my_houses_locs[key] = true;
	}

	for (let house of opp_houses) {
		let key = `${house.x}|${house.y}`;
		opp_houses_locs[key] = true;
	}

	// --------------------------------------------------------------------------------------------

	let locked = [];
	let pending = [];
	let failed = [];

	let forbidden = Object.create(null);		// All locs (as strings) that can't be moved to.

	for (let move of moveslist) {

		if (move.x1 === move.x2 && move.y1 === move.y2) {			// Stationary succeeds.

			locked.push(move);
			forbidden[move.ss] = true;

		} else if (my_houses_locs[move.ts]) {						// Move to friendly house succeeds.

			locked.push(move);

		} else if (opp_houses_locs[move.ts]) {						// Move to enemy house fails.

			failed.push(move);
			forbidden[move.ss] = true;

		} else {													// Pending... any move to open ground.

			pending.push(move);

		}
	}

	// Make map of target(string) --> [sources]

	let target_source_map = Object.create(null);

	for (let move of pending) {

		if (target_source_map[move.ts]) {
			target_source_map[move.ts].push(move);
		} else {
			target_source_map[move.ts] = [move];
		}
	}

	while (true) {

		let rejections_happened = false;

		// Reject moves that bump...

		for (let [ts, sources] of Object.entries(target_source_map)) {
			if (sources.length > 1 || forbidden[ts]) {
				for (let move of sources) {
					failed.push(move);
					forbidden[move.ss] = true;
				}
				rejections_happened = true;
				delete target_source_map[ts];
			}
		}

		if (rejections_happened === false) {
			for (let move of still_pending) {
				locked.push(move);
			}
			break;
		}
	}

	// Think that's right. TODO - return something.
}
