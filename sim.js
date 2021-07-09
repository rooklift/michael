"use strict";

function new_move_from_unit(unit) {

	let next_cell = unit.next_cell();						// guaranteed in-bounds

	return {
		unit: unit,
		next_cell: next_cell,
		ss: `${unit.x}|${unit.y}`,							// source as a string
		ts: `${next_cell.x}|${next_cell.y}`,				// target as a string
	};
}

function analyse_moves(frame, team) {

	// FIXME - out of bounds not currently detected because next_cell() already considers them as stationary.

	let my_houses = frame.houses_by_team(team);
	let opp_houses = frame.houses_by_team((team + 1) % 2);

	let my_houses_locs = Object.create(null);
	let opp_houses_locs = Object.create(null);

	for (let house of my_houses) {
		my_houses_locs[house.loc_string()] = true;
	}

	for (let house of opp_houses) {
		opp_houses_locs[house.loc_string()] = true;
	}

	// --------------------------------------------------------------------------------------------

	let moveslist = [];

	for (let unit of frame.units_by_team(team)) {
		moveslist.push(new_move_from_unit(unit));			// Every friendly unit is in the moveslist, including non-moving ones.
	}

	// --------------------------------------------------------------------------------------------

	let effective = [];
	let holding = [];
	let cooling = [];
	let failing = [];

	let pending = [];

	let forbidden = Object.create(null);					// Locs (as strings) that can't be moved to.

	for (let move of moveslist) {

		if (move.unit.cd > 0) {																			// Unit is on cooldown.
			forbidden[move.ss] = true;
			cooling.push(move);

		} else if (opp_houses_locs[move.ts]) {															// Move to enemy house fails.
			forbidden[move.ss] = true;
			failing.push(move);

		} else if (move.ss === move.ts) {																// Stationary.
			forbidden[move.ss] = true;
			holding.push(move);

		} else if (my_houses_locs[move.ts]) {															// Move to friendly house succeeds.
			effective.push(move);

		} else {																						// Pending... any move to open ground.
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

	// Reject moves that bump into something...

	while (true) {

		let rejections_happened = false;

		for (let [ts, moves] of Object.entries(target_move_map)) {
			if (moves.length > 1 || forbidden[ts]) {
				for (let move of moves) {
					forbidden[move.ss] = true;				// Unit's move was invalid... it won't move... its loc becomes forbidden.
					failing.push(move);
				}
				rejections_happened = true;
				delete target_move_map[ts];
			}
		}

		if (rejections_happened === false) {
			for (let moves of Object.values(target_move_map)) {
				for (let move of moves) {
					effective.push(move);
				}
			}
			break;
		}
	}

	if (effective.length + holding.length + cooling.length + failing.length !== moveslist.length) {
		throw "faulty function";
	}

	return {effective, holding, cooling, failing};
}

// ------------------------------------------------------------------------------------------------

module.exports = {new_move_from_unit, analyse_moves};
