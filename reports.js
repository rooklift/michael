"use strict";

function objects(frame) {

	let lines = [];

	lines.push(`Turn ${frame.turn}.............................................................`);

	for (let team of [0, 1]) {

		let units = frame.list_units(team);
		let houses = frame.list_houses(team);

		let have_said_player = false;

		for (let unit of units) {

			let s = "";

			if (!have_said_player) {
				s += `Player ${team}: `;
				have_said_player = true;
			} else {
				s += `          `;
			}

			s += `${unit.id} [${unit.x}, ${unit.y}] - ${unit.type}`;

			lines.push(s);
		}

		let have_said_cities = {};

		for (let house of houses) {

			let s = "";

			if (!have_said_player) {
				s += `Player ${team}: `;
				have_said_player = true;
			} else {
				s += `          `;
			}

			if (!have_said_cities[house.id]) {
				let city = frame.city_from_house(house);
				s += `${house.id} [${house.x}, ${house.y}] - house, ${house.cd} cd (city ${city.id} has ${city.fuel} fuel, ${city.lk} lk)`;
				have_said_cities[house.id] = true;
			} else {
				s += `${house.id} [${house.x}, ${house.y}] - house, ${house.cd} cd`;
			}

			lines.push(s);
		}

	}

	return lines.join("\n");
}

function map(frame) {

	let lines = [];
	lines.push("-".repeat(frame.width));

	for (let y = 0; y < frame.height; y++) {
		let line = [];
		for (let x = 0; x < frame.width; x++) {
			line.push(frame.map[x][y].type ? frame.map[x][y].type : " ");
		}
		lines.push(line.join(""));
	}

	lines.push("-".repeat(frame.width));
	return lines.join("\n");
}



module.exports = {objects, map};
