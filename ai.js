"use strict";

function ai(bot, game, team) {

	let reservations = [];

	for (let unit of game.list_units(team)) {

		let target;
		let build_flag;
		let move_info;

		if (unit.weight() === 100) {
			target = unit.nearest_needy_house();
			if (!target) {
				build_flag = true;
				target = unit.nearest_house();
			}
		}

		if (!target) {
			target = unit.nearest_resource("wood");
		}

		if (build_flag && unit.cell().type === "") {
			bot.send(`bcity ${unit.id}`);
		} else if (target) {
			move_info = unit.move_info(target);
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

	for (let house of game.list_houses(team)) {
		bot.send(`bw ${house.x} ${house.y}`);
	}

	bot.send("D_FINISH");
}



module.exports = ai;
