"use strict";

const new_bot = require("./antikit/bot");

new_bot("bad_bot", (frame, team) => {

	let reservations = [];

	let my_units = frame.units_by_team(team);
	let my_houses = frame.houses_by_team(team);

	let all_wood = frame.resources("wood");
	let needy_houses = my_houses.filter(house => house.needy());
	let empty_spaces = frame.resources("").filter(cell => cell.house() === undefined);

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
		} else if (build_flag && unit.cell().type === "" && !nearest_house) {
			unit.order_build();
		} else if (target) {
			direction = unit.naive_direction(target);
		}

		if (direction) {

			let next_cell = unit.adjacent_cell(direction);
			let ok = true;

			for (let rs of reservations) {
				if (rs === next_cell) {
					ok = false;
					break;
				}
			}

			if (ok) {
				unit.order_move(direction);
				reservations.push(next_cell);
			}
		}
	}

	let doods_requested = 0;

	for (let house of my_houses) {
		if (house.cd === 0) {
			if (my_houses.length > my_units.length + doods_requested) {
				house.order_worker();
				doods_requested++;
			} else {
				house.order_research();
			}
		}
	}
});
