"use strict";

const new_bot = require("./antikit/bot");
const sim = require("./sim");

new_bot("bad_bot", (frame, team) => {
	try {
		ai(frame, team);
	} catch (err) {
		log(err);
	}
});

function ai(frame, team) {

	let reservations = [];		// Must only hold cell objects - which are compared by object identity

	let my_units = frame.units_by_team(team);
	let my_houses = frame.houses_by_team(team);

	let opp_houses = frame.houses_by_team((team + 1) % 2);

	let all_resources = frame.resources("wood");
	if (frame.rp[team] >= 50) {
		all_resources = all_resources.concat(frame.resources("coal"));
	}
	if (frame.rp[team] >= 200) {
		all_resources = all_resources.concat(frame.resources("uranium"));
	}

	let needy_houses = my_houses.filter(house => house.needy());
	let empty_spaces = frame.resources("").filter(cell => cell.house() === undefined);

	if (frame.turn < 30 && my_houses.length === 1) {	// First day, haven't built 2nd house.
		needy_houses = [];
	}

	for (let house of opp_houses) {
		reservations.push(house.cell());
	}

	for (let unit of my_units) {
		if (unit.cd > 0) {
			if (unit.house() === undefined) {
				reservations.push(unit.cell());
			}
		}
	}

	my_units.sort((a, b) => b.fuel() - a.fuel());		// Sort high-fuel units to start, so they have priority.

	for (let unit of my_units) {

		if (unit.cd > 0) {
			continue;
		}

		if (frame.is_night() && unit.house()) {
			continue;
		}

		let nearest_house = unit.choose(my_houses);

		let target;
		let build_flag;
		let direction;

		if (unit.weight() >= 90 || unit.fuel() >= 100) {
			if (needy_houses.length > 0) {
				target = unit.choose(needy_houses);
			} else {
				if (unit.weight() === 100) {
					build_flag = true;
					if (nearest_house && (frame.turn >= 30 || my_houses.length >= 2)) {
						target = nearest_house.choose(empty_spaces);
					} else {
						target = unit.choose(empty_spaces);
					}
				} else {
					target = nearest_house;
				}
			}
		} else {
			target = unit.choose(all_resources);
		}

		if (build_flag && unit.cell().type === "") {

			let ok = false;

			if (!nearest_house) {
				ok = true;
			} else if (unit.distance(nearest_house) === 1) {
				ok = true;
			} else if (frame.turn < 30 && my_houses.length === 1) {
				ok = true;
			}

			if (ok) {
				unit.order_build();
				target = null;
			}
		}

		if (target && (target.x !== unit.x || target.y !== unit.y)) {

			unit.lineto(target);

			for (let direction of unit.sorted_directions(target).filter(d => d !== "c")) {

				let next_cell = unit.adjacent_cell(direction);

				if (!reservations.includes(next_cell)) {
					unit.order_move(direction);
					if (next_cell.house() === undefined) {
						reservations.push(next_cell);
					}
					break;
				}
			}

		} else {

			if (unit.house() === undefined) {
				reservations.push(unit.cell());
			}

		}
	}

	let doods_requested = 0;
	let research_requested = 0;

	for (let house of my_houses) {
		if (house.cd === 0) {
			if (my_units.length + doods_requested < my_houses.length) {
				house.order_worker();
				doods_requested++;
			} else if (frame.rp[team] + research_requested < 200) {
				house.order_research();
				research_requested++;
			}
		}
	}

	// Testing...

	let failing = sim.analyse_moves(frame, team).failing;

	for (let move of failing) {
		move.unit.cancel();
	}

}
