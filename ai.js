"use strict";

function ai(bot, frame, team) {

	let reservations = [];

	let my_units = frame.list_units(team);
	let my_houses = frame.list_houses(team);

	for (let unit of my_units) {

		if (unit.cd > 0) {
			continue;
		}

		let target;
		let build_flag;
		let move_info;

		if (unit.weight() === 100) {
			target = unit.nearest_needy_house();
			if (!target) {
				if (unit.wood === 100) {			// Require 100 wood for a house, not just any resource.
					build_flag = true;
				}
				target = unit.nearest_house();
			}
		}

		if (!target) {
			target = unit.nearest_resource("wood");
		}

		if (build_flag && unit.cell().type === "") {
			bot.send(`bcity ${unit.id}`);
		} else if (target) {
			move_info = unit.move_towards(target);
		}

		if (move_info) {

			let ok = true;

			for (let rs of reservations) {
				if (rs.x2 === move_info.x2 && rs.y2 === move_info.y2) {
					ok = false;
					break;
				}
			}

			if (ok) {
				bot.send(`m ${unit.id} ${move_info.direction}`);
				reservations.push(move_info);
			}
		}
	}

	for (let house of my_houses) {
		if (house.cd === 0) {
			if (my_houses.length > my_units.length) {
				bot.send(`bw ${house.x} ${house.y}`);
			} else {
				bot.send(`r ${house.x} ${house.y}`);
			}
		}
	}

	bot.send("D_FINISH");
}



module.exports = ai;
