"use strict";

function objects(game) {

	let lines = [];

	lines.push(`Turn ${game.turn}.............................................................`);

	for (let pid of [0, 1]) {

		let units = game.get_units(pid);
		let tiles = game.get_tiles(pid);

		let have_said_player = false;

		for (let unit of units) {

			let s = "";

			if (!have_said_player) {
				s += `Player ${pid}: `;
				have_said_player = true;
			} else {
				s += `          `;
			}

			s += `${unit.id} [${unit.x}, ${unit.y}] - ${unit.type}`;

			lines.push(s);
		}

		let have_said_cities = {};

		for (let tile of tiles) {

			let s = "";

			if (!have_said_player) {
				s += `Player ${pid}: `;
				have_said_player = true;
			} else {
				s += `          `;
			}

			if (!have_said_cities[tile.id]) {
				let city = game.get_city_from_tile(tile);
				s += `${tile.id} [${tile.x}, ${tile.y}] - tile, ${tile.cd} cd (city ${city.id} has ${city.fuel} fuel, ${city.lk} lk)`;
				have_said_cities[tile.id] = true;
			} else {
				s += `${tile.id} [${tile.x}, ${tile.y}] - tile, ${tile.cd} cd`;
			}

			lines.push(s);
		}

	}

	return lines.join("\n");
}

function map(game) {

	let lines = [];
	lines.push("-".repeat(game.width));

	for (let y = 0; y < game.height; y++) {
		let line = [];
		for (let x = 0; x < game.width; x++) {
			line.push(game.map[x][y].type ? game.map[x][y].type : " ");
		}
		lines.push(line.join(""));
	}

	lines.push("-".repeat(game.width));
	return lines.join("\n");
}



module.exports = {objects, map};
