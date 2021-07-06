"use strict";

const new_bot = require("./antikit/bot");

new_bot("bad_bot", (frame, team) => {

	let reservations = [];		// Must only hold cell objects - which are compared by object identity

	let my_units = frame.units_by_team(team);
	let my_houses = frame.houses_by_team(team);

	let all_wood = frame.resources("wood");
	let needy_houses = my_houses.filter(house => house.needy());
	let empty_spaces = frame.resources("").filter(cell => cell.house() === undefined);

	for (let unit of my_units) {
		if (unit.cd > 0) {
			if (unit.house() === undefined) {
				reservations.push(unit.cell());
			}
		}
	}

	for (let unit of my_units) {

		if (unit.cd > 0) {
			continue;
		}

		let nearest_house = unit.choose(my_houses);

		let target;
		let build_flag;
		let direction;

		if (unit.weight() === 100) {
			if (needy_houses.length > 0) {
				target = unit.choose(needy_houses);
			} else {
				if (unit.wood === 100) {			// Require 100 wood for a house, not just any resource.
					build_flag = true;
					if (nearest_house) {
						target = nearest_house.choose(empty_spaces);
					} else {
						target = unit.choose(empty_spaces);
					}
				} else {
					target = nearest_house;
				}
			}
		} else if (unit.cell().type !== "wood") {
			target = unit.choose(all_wood);
		}

		if (build_flag && unit.cell().type === "" && nearest_house && unit.distance(nearest_house) === 1) {
			unit.order_build();
			target = null;
		} else if (build_flag && unit.cell().type === "" && !nearest_house) {
			unit.order_build();
			target = null;
		}

		if (target) {

			for (let direction of unit.sorted_directions(target)) {

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
});
