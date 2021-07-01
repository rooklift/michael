"use strict";

function ai(bot, game, team) {

	for (let unit of game.list_units(team)) {

		let target;
		let build_flag;

		if (unit.weight() === 100) {
			target = unit.nearest_house();
		} else {
			target = unit.nearest_resource("wood");
		}

		if (target && target.is_house) {
			let city = target.city();
			if (city.fuel >= city.lk * 10) {
				build_flag = true;
			}
		}

		if (build_flag && unit.cell().type === "") {
			bot.send(`bcity ${unit.id}`);
		} else if (target) {
			bot.send(`m ${unit.id} ${unit.direction_to(target)}`);
		}
	}

	for (let house of game.list_houses(team)) {
		bot.send(`bw ${house.x} ${house.y}`);
	}

	bot.send("D_FINISH");
}



module.exports = ai;
