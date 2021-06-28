"use strict";

function new_game_state(width, height) {

	let game = Object.assign({}, game_state_props);

	game.width = width;
	game.height = height;
	game.map = [];

	for (let x = 0; x < width; x++) {
		game.map.push([]);
		for (let y = 0; y < height; y++) {
			game.map[x].push({});
		}
	}

	game.reset();
	return game;
}

let game_state_props = {

	reset: function() {

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.map[x][y].type = "";
				this.map[x][y].val = 0;
				this.map[x][y].cd = 1;		// Is this right? ccd is "only sent for any cells with cooldowns not equal to 1" -- logic.d.ts
			}
		}

		this.rp = [0, 0];
		this.units = [];
		this.cities = [];
		this.tiles = [];
	},

	string: function() {

		let lines = ["-".repeat(this.width)];

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

	parse: function(fields) {

		if (fields[0] === "c") {				// c t city_id f lk

			let team = parseInt(fields[1], 10);
			let id = fields[2];
			let fuel = parseInt(fields[3], 10);
			let lk = parseInt(fields[4], 10);

			this.cities.push({team, id, fuel, lk});
			return;
		}

		if (fields[0] === "ccd") {				// ccd x y cd

			let x = parseInt(fields[1], 10);
			let y = parseInt(fields[2], 10);
			let cd = parseInt(fields[3], 10);

			this.map[x][y].cd = cd;
			return;
		}

		if (fields[0] === "ct") {				// ct t city_id x y cd

			let team = parseInt(fields[1], 10);
			let id = fields[2];
			let x = parseInt(fields[3], 10);
			let y = parseInt(fields[4], 10);
			let cd = parseInt(fields[5], 10);

			this.tiles.push({team, id, x, y, cd});
			return;
		}

		if (fields[0] === "r") {				// r resource_type x y amount

			let type = fields[1][0];
			let x = parseInt(fields[2], 10);
			let y = parseInt(fields[3], 10);
			let amount = parseInt(fields[4], 10);

			this.map[x][y].type = type;
			this.map[x][y].amount = amount;
			return;
		}

		if (fields[0] === "rp") {				// rp t points

			let team = parseInt(fields[1], 10);
			let points = parseInt(fields[2], 10);

			this.rp[team] = points;
			return;
		}

		if (fields[0] === "u") {				// u unit_type t unit_id x y cd w c u

			let type = parseInt(fields[1], 10);
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
	},

};



module.exports = new_game_state;
