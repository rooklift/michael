"use strict";

function new_game_state(width, height) {
	let game = Object.assign({}, game_state_props);
	game.width = width;
	game.height = height;
	game.turn = null;
	game.reset();
	return game;
}

let game_state_props = {

	reset: function() {

		if (!this.map) {

			this.map = [];				// 2D list of {type, amount, cd}

			for (let x = 0; x < this.width; x++) {
				this.map.push([]);
				for (let y = 0; y < this.height; y++) {
					this.map[x].push({});
				}
			}
		}

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.map[x][y].type = "";
				this.map[x][y].amount = 0;
				this.map[x][y].road = 0;				// Is this right?
			}
		}

		this.rp = [0, 0];
		this.units = [];				// List of {type, team, id, x, y, cd, wood, coal, uranium}
		this.tiles = [];				// List of {team, id, x, y, cd}
		this.cities = [];				// List of {team, id, fuel, lk}
	},

	map_string: function() {

		let lines = [];
		lines.push("-".repeat(this.width));

		for (let y = 0; y < this.height; y++) {
			let line = [];
			for (let x = 0; x < this.width; x++) {
				line.push(this.map[x][y].type ? this.map[x][y].type : " ");
			}
			lines.push(line.join(""));
		}

		lines.push("-".repeat(this.width));
		return lines.join("\n");
	},

	report_string: function() {

		let lines = [];

		lines.push(`Turn ${this.turn}.............................................................`);

		for (let pid of [0, 1]) {

			let units = this.get_units(pid);
			let tiles = this.get_tiles(pid);

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
					let city = this.get_city_from_tile(tile);
					s += `${tile.id} [${tile.x}, ${tile.y}] - tile, ${tile.cd} cd (city ${city.id} has ${city.fuel} fuel, ${city.lk} lk)`;
					have_said_cities[tile.id] = true;
				} else {
					s += `${tile.id} [${tile.x}, ${tile.y}] - tile, ${tile.cd} cd`;
				}

				lines.push(s);
			}

		}

		return lines.join("\n");
	},

	get_units: function(pid) {
		let ret = []
		for (let unit of this.units) {
			if (unit.team === pid) {
				ret.push(unit);
			}
		}
		return ret;
	},

	get_tiles: function(pid) {
		let ret = [];
		for (let tile of this.tiles) {
			if (tile.team === pid) {
				ret.push(tile);
			}
		}
		return ret;
	},

	get_city_from_tile: function(tile) {
		for (let city of this.cities) {
			if (city.id === tile.id) {
				return city;
			}
		}
		return undefined;
	},

	parse: function(bot, fields) {		// bot is provided just so we can use its log() method

		// Arranged to match the order in kit.js

		if (fields[0] === "rp") {						// rp t points

			let team = parseInt(fields[1], 10);
			let points = parseInt(fields[2], 10);

			this.rp[team] = points;
			return;
		}

		if (fields[0] === "r") {						// r resource_type x y amount

			let type = fields[1][0];
			let x = parseInt(fields[2], 10);
			let y = parseInt(fields[3], 10);
			let amount = parseInt(fields[4], 10);

			this.map[x][y].type = type;
			this.map[x][y].amount = amount;
			return;
		}

		if (fields[0] === "u") {						// u unit_type t unit_id x y cd w c u

			let type = ["worker", "cart"][parseInt(fields[1], 10)];
			let team = parseInt(fields[2], 10);
			let id = fields[3];
			let x = parseInt(fields[4], 10);
			let y = parseInt(fields[5], 10);
			let cd = parseInt(fields[6], 10);
			let wood = parseInt(fields[7], 10);
			let coal = parseInt(fields[8], 10);
			let uranium = parseInt(fields[9], 10);

			this.units.push({type, team, id, x, y, cd, wood, coal, uranium});
			return;
		}

		if (fields[0] === "c") {						// c t city_id f lk

			let team = parseInt(fields[1], 10);
			let id = fields[2];
			let fuel = parseInt(fields[3], 10);
			let lk = parseInt(fields[4], 10);

			this.cities.push({team, id, fuel, lk});
			return;
		}

		if (fields[0] === "ct") {						// ct t city_id x y cd

			let team = parseInt(fields[1], 10);
			let id = fields[2];
			let x = parseInt(fields[3], 10);
			let y = parseInt(fields[4], 10);
			let cd = parseInt(fields[5], 10);

			this.tiles.push({team, id, x, y, cd});
			return;
		}

		if (fields[0] === "ccd") {						// ccd x y cd

			let x = parseInt(fields[1], 10);
			let y = parseInt(fields[2], 10);
			let road = parseInt(fields[3], 10);

			this.map[x][y].road = road;
			return;
		}
	},

};



module.exports = new_game_state;
