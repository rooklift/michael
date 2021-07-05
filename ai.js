"use strict";

module.exports = function(frame, team) {

	let reservations = [];

	let my_units = frame.units_by_team(team);
	let my_houses = frame.houses_by_team(team);

	for (let unit of my_units) {

		if (unit.cd > 0) {
			continue;
		}

		let target;
		let build_flag;
		let direction;

		if (unit.weight() === 100) {
			target = unit.nearest_needy_house(team);
			if (!target) {
				if (unit.wood === 100) {			// Require 100 wood for a house, not just any resource.
					build_flag = true;
					target = unit.nearest_resource("");
				} else {
					target = unit.nearest_house(team);
				}
			}
		} else {
			target = unit.nearest_resource("wood");
		}

		if (build_flag && unit.cell().type === "") {
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

	frame.send_orders();
};
