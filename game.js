"use strict";

const new_city = require("./city");
const new_house = require("./house");
const new_unit = require("./unit");

function new_game(width, height) {
	let game = Object.assign({}, game_props);
	game.width = width;
	game.height = height;
	game.turn = null;
	game.reset();
	return game;
}

let game_props = {

	reset() {

		if (!this.map) {

			this.map = [];				// 2D list of {type, amount, road}

			for (let x = 0; x < this.width; x++) {
				this.map.push([]);
				for (let y = 0; y < this.height; y++) {
					this.map[x].push({x, y});
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
		this.units = [];
		this.houses = [];
		this.cities = [];
	},

	list_units(team) {
		if (typeof team !== "number") throw "bad call";
		return this.units.filter(z => z.team === team);
	},

	list_houses(team) {
		if (typeof team !== "number") throw "bad call";
		return this.houses.filter(z => z.team === team);
	},

	city_from_house(house) {
		if (!house.is_house) throw "bad call";
		for (let city of this.cities) {
			if (city.id === house.id) {
				return city;
			}
		}
		return undefined;
	},

	list_resources() {

		let ret = [];

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				if (this.map[x][y].type) {
					ret.push(this.map[x][y]);
				}
			}
		}

		return ret;
	},

	parse(fields) {

		// Arranged to match the order in kit.js

		if (fields[0] === "rp") {						// rp t points

			let team = parseFloat(fields[1]);
			let points = parseFloat(fields[2]);

			this.rp[team] = points;
			return;
		}

		if (fields[0] === "r") {						// r resource_type x y amount

			let type = fields[1];
			let x = parseFloat(fields[2]);
			let y = parseFloat(fields[3]);
			let amount = parseFloat(fields[4]);

			this.map[x][y].type = amount > 0 ? type : "";
			this.map[x][y].amount = amount;
			return;
		}

		if (fields[0] === "u") {						// u unit_type t unit_id x y cd w c u

			let type = ["worker", "cart"][parseInt(fields[1], 10)];
			let team = parseFloat(fields[2]);
			let id = fields[3];
			let x = parseFloat(fields[4]);
			let y = parseFloat(fields[5]);
			let cd = parseFloat(fields[6]);
			let wood = parseFloat(fields[7]);
			let coal = parseFloat(fields[8]);
			let uranium = parseFloat(fields[9]);

			this.units.push(new_unit(this, type, team, id, x, y, cd, wood, coal, uranium));
			return;
		}

		if (fields[0] === "c") {						// c t city_id f lk

			let team = parseFloat(fields[1]);
			let id = fields[2];
			let fuel = parseFloat(fields[3]);
			let lk = parseFloat(fields[4]);

			this.cities.push(new_city(this, team, id, fuel, lk));
			return;
		}

		if (fields[0] === "ct") {						// ct t city_id x y cd

			let team = parseFloat(fields[1]);
			let id = fields[2];
			let x = parseFloat(fields[3]);
			let y = parseFloat(fields[4]);
			let cd = parseFloat(fields[5]);

			this.houses.push(new_house(this, team, id, x, y, cd));
			return;
		}

		if (fields[0] === "ccd") {						// ccd x y cd

			let x = parseFloat(fields[1]);
			let y = parseFloat(fields[2]);
			let road = parseFloat(fields[3]);

			this.map[x][y].road = road;
			return;
		}
	},

};



module.exports = new_game;
