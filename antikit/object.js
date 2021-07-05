"use strict";

const utils = require("./utils");

// Prototype for cell, house, unit -- relies on them having:
//
//		this.frame
//		this.x
//		this.y
//		this.cmd

module.exports = {

	command(s) {
		this.cmd.val = s;
	},

	transmit() {
		if (this.cmd.val) {
			send(this.cmd.val);
		}
	},

	annotate() {
		if (this.is_cell) {
			this.command(`dc ${this.x} ${this.y}`);
		} else {
			this.cell().annotate();
		}
	},

	distance(dwim1, dwim2) {
		let [x, y] = utils.resolve_dwim_args(dwim1, dwim2);
		return Math.abs(x - this.x) + Math.abs(y - this.y);
	},

	// Note that most of the getters can return undefined / [] etc as appropriate.

	cell() {
		return this.frame.map[this.x][this.y];
	},

	house() {
		return this.frame.house_at(this.x, this.y);
	},

	units() {
		return this.frame.units_at(this.x, this.y);
	},

	nearest_resource(type) {
		if (["wood", "coal", "uranium"].includes(type) === false) throw "bad call";
		return this.frame.resources(type).sort((a, b) => this.distance(a) - this.distance(b))[0];
	},

	nearest_house(team) {
		if (typeof team !== "number") throw "bad call";
		return this.frame.houses_by_team(team).sort((a, b) => this.distance(a) - this.distance(b))[0];
	},

	nearest_needy_house(team) {
		if (typeof team !== "number") throw "bad call";
		return this.frame.houses_by_team(team).filter(house => house.needy()).sort((a, b) => this.distance(a) - this.distance(b))[0];
	},

	nearest_unit(team) {
		if (typeof team !== "number") throw "bad call";
		return this.frame.units_by_team(team).sort((a, b) => this.distance(a) - this.distance(b))[0];
	},

	naive_direction(dwim1, dwim2) {
		let [targetx, targety] = utils.resolve_dwim_args(dwim1, dwim2);
		let dx_abs = Math.abs(this.x - targetx);
		let dy_abs = Math.abs(this.y - targety);
		if (this.x === targetx && this.y === targety) {
			return "c";
		}
		if (dx_abs > dy_abs) {
			return targetx - this.x < 0 ? "w" : "e";
		} else {
			return targety - this.y < 0 ? "n" : "s";
		}
	},

	adjacent_cell(d) {
		try {
			if (d === "c") return this.frame.map[this.x][this.y];
			if (d === "n") return this.frame.map[this.x][this.y - 1];
			if (d === "s") return this.frame.map[this.x][this.y + 1];
			if (d === "w") return this.frame.map[this.x - 1][this.y];
			if (d === "e") return this.frame.map[this.x + 1][this.y];
		} catch (err) {
			return undefined;		// out of bounds
		}
		throw "bad call";			// argument wasn't in "cnswe"
	},

};
