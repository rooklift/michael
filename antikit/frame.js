"use strict";

const new_cell = require("./cell");
const new_city = require("./city");
const new_house = require("./house");
const new_unit = require("./unit");

function new_frame(width, height, turn) {

	let frame = Object.create(frame_props);
	Object.assign(frame, {width, height, turn});
	frame.init();
	return frame;

}

let frame_props = {

	init() {
		this.map = [];
		for (let x = 0; x < this.width; x++) {
			this.map.push([]);
			for (let y = 0; y < this.height; y++) {
				this.map[x].push(new_cell(this, x, y, "", 0, 0));
			}
		}
		this.rp = [0, 0];
		this.units = [];
		this.houses = [];
		this.cities = [];
	},

	list_units(team) {
		if (team !== undefined) {
			if (typeof team !== "number") throw "bad call";
			return this.units.filter(z => z.team === team);
		}
		return Array.from(this.units);
	},

	list_houses(team) {
		if (team !== undefined) {
			if (typeof team !== "number") throw "bad call";
			return this.houses.filter(z => z.team === team);
		}
		return Array.from(this.houses);
	},

	list_resources(type) {

		let ret = [];

		if (type !== undefined) {
			if (["wood", "coal", "uranium"].includes(type) === false) throw "bad call";
		}

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				if (this.map[x][y].amount > 0) {
					if (type === undefined || this.map[x][y].type === type) {
						ret.push(this.map[x][y]);
					}
				}
			}
		}

		return ret;
	},

	get_city_by_id(id) {
		for (let city of this.cities) {
			if (city.id === id) {
				return city;
			}
		}
		return undefined;
	},

	get_house_at(x, y) {
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

			if (type !== "wood" && type !== "coal" && type !== "uranium") {
				throw "unknown resource type";
			}

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

	freeze() {
		this.__freeze_recurse(this);
	},

	__freeze_recurse(o) {		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze

		for (let key of Object.getOwnPropertyNames(o)) {

			if (key === "frame") {
				continue;							// Avoid infinite circular recursion.
			}

			let value = o[key];

			if (typeof value === "object" && value !== null) {
				this.__freeze_recurse(value);
			}
		}

		Object.freeze(o);
	},

	// --------------------------------------------------------------------------------------------

	send_orders() {

		for (let unit of this.units) {
			if (unit.cmd) {
				send(unit.cmd);
			}
		}

		for (let house of this.houses) {
			if (house.cmd) {
				send(house.cmd);
			}
		}

		send("D_FINISH");
	},

};



module.exports = new_frame;
