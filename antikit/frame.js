"use strict";

const new_city = require("./city");
const new_cell = require("./object_cell");
const new_house = require("./object_house");
const new_unit = require("./object_unit");

const utils = require("./utils");

// ------------------------------------------------------------------------------------------------

function new_frame(width, height, turn) {
	let frame = Object.assign(Object.create(frame_prototype), {width, height, turn});
	frame.init();
	return frame;
}

// ------------------------------------------------------------------------------------------------

let frame_prototype = {

	init() {
		this.map = [];
		for (let x = 0; x < this.width; x++) {
			this.map.push([]);
			for (let y = 0; y < this.height; y++) {
				this.map[x].push(new_cell(this, x, y, "", 0, 0));
			}
		}
		this.rp = [0, 0];
		this.units  = [];
		this.houses = [];
		this.cities = [];
	},

	copy() {

		let ret = new_frame(this.width, this.height, this.turn);

		// All the cells point to ret as their frame, but other values need updating...

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				ret.map[x][y].type = this.map[x][y].type;
				ret.map[x][y].amount = this.map[x][y].amount;
				ret.map[x][y].road = this.map[x][y].road;
			}
		}

		// Make other objects...

		ret.rp = Array.from(this.rp);
		ret.units = this.units.map(unit => unit.copy());
		ret.houses = this.houses.map(house => house.copy());
		ret.cities = this.cities.map(city => city.copy());

		// All the objects need their frame updated...

		for (let unit of ret.units) {
			unit.frame = ret;
		}
		for (let house of ret.houses) {
			house.frame = ret;
		}
		for (let city of ret.cities) {
			city.frame = ret;
		}

		return ret;
	},

	is_night() {
		return this.turn % 40 > 29;
	},

	resources(type) {

		if (["wood", "coal", "uranium", ""].includes(type) === false) throw "bad call";

		let ret = [];

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				if (this.map[x][y].type === type) {
					ret.push(this.map[x][y]);
				}
			}
		}

		return ret;
	},

	city_by_id(id) {
		if (typeof id !== "string") throw "bad call";
		for (let city of this.cities) {
			if (city.id === id) {
				return city;
			}
		}
		return undefined;
	},

	units_by_team(team) {
		if (typeof team !== "number") throw "bad call";
		return this.units.filter(z => z.team === team);
	},

	units_at(dwim1, dwim2) {
		let [x, y] = utils.resolve_dwim_args(dwim1, dwim2);
		return this.units.filter(z => z.x === x && z.y === y);
	},

	houses_by_team(team) {
		if (typeof team !== "number") throw "bad call";
		return this.houses.filter(z => z.team === team);
	},

	houses_by_city_id(id) {
		if (typeof id !== "string") throw "bad call";
		return this.houses.filter(z => z.id === id);
	},

	house_at(dwim1, dwim2) {
		let [x, y] = utils.resolve_dwim_args(dwim1, dwim2);
		for (let house of this.houses) {
			if (house.x === x && house.y === y) {
				return house;
			}
		}
		return undefined;
	},

	// --------------------------------------------------------------------------------------------

	parse(fields) {

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
			this.map[x][y].amount = amount > 0 ? amount : 0;
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
			let upkeep = parseFloat(fields[4]);

			this.cities.push(new_city(this, team, id, fuel, upkeep));
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

	// --------------------------------------------------------------------------------------------

	send_orders() {

		for (let unit of this.units) {
			unit.transmit();
		}

		for (let house of this.houses) {
			house.transmit();
		}

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.map[x][y].transmit();
			}
		}

		console.log("D_FINISH");
	},

};

// ------------------------------------------------------------------------------------------------

module.exports = new_frame;
