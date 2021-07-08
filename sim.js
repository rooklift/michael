"use strict";

function new_move(id, x1, y1, x2, y2) {
	return {
		id,
		x1,
		y1,
		x2,
		y2,
		ss: `${x1}|${y1}`,			// source as a string
		ts: `${x2}|${y2}`,			// target as a string
	};
}

function new_move_from_unit(unit) {
	let next_cell = unit.next_cell();
	return new_move(unit.id, unit.x, unit.y, next_cell.x, next_cell.y);
}

function resolve(frame, team, moveslist) {

	// Note that every friendly unit should be in the moveslist; units with cooldown should be given as stationary.
	// Note that the return value is a list of actual moves (hold position "moves" aren't included).

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

	let valid = [];								// Only holds actual moves, not stationaries.
	let pending = [];

	let forbidden = Object.create(null);		// Locs (as strings) that can't be moved to.

	for (let move of moveslist) {

		if (move.x2 < 0 || move.y2 < 0 || move.x2 >= frame.width || move.y2 >= frame.height) {		// Move to out-of-bounds fails.
			forbidden[move.ss] = true;
		} else if (move.x1 === move.x2 && move.y1 === move.y2) {									// Stationary.
			forbidden[move.ss] = true;
		} else if (opp_houses_locs[move.ts]) {														// Move to enemy house fails.
			forbidden[move.ss] = true;
		} else if (my_houses_locs[move.ts]) {														// Move to friendly house succeeds.
			valid.push(move);
		} else {																					// Pending... any move to open ground.
			pending.push(move);
		}
	}

	// Make map of: target(string) --> [moves going there]

	let target_move_map = Object.create(null);

	for (let move of pending) {
		if (target_move_map[move.ts]) {
			target_move_map[move.ts].push(move);
		} else {
			target_move_map[move.ts] = [move];
		}
	}

	while (true) {

		let rejections_happened = false;

		// Reject moves that bump into something...

		for (let [ts, moves] of Object.entries(target_move_map)) {
			if (moves.length > 1 || forbidden[ts]) {
				for (let move of moves) {
					forbidden[move.ss] = true;		// Unit's move was invalid... it won't move... its loc becomes forbidden.
				}
				rejections_happened = true;
				delete target_move_map[ts];
			}
		}

		if (rejections_happened === false) {
			for (let moves of Object.values(target_move_map)) {
				for (let move of moves) {
					valid.push(move);
				}
			}
			break;
		}
	}

	return valid;
}

// ------------------------------------------------------------------------------------------------

module.exports = {new_move, new_move_from_unit, resolve};
