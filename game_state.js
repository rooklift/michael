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
				this.map[x][y].road = 0;
			}
		}

		this.rp = [0, 0];
		this.units = [];				// List of {type, team, id, x, y, cd, wood, coal, uranium}
		this.tiles = [];				// List of {team, id, x, y, cd}
		this.cities = [];				// List of {team, id, fuel, lk}
	},

	get_units: function(pid) {
		return this.units.filter(z => z.team === pid);
	},

	get_tiles: function(pid) {
		return this.tiles.filter(z => z.team === pid);
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
