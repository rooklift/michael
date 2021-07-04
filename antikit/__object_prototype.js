"use strict";

// Common methods for cell, house, unit -- relies on them having:
//
//		this.frame
//		this.x
//		this.y
//		this.cmd
//
// Note that most of the getters can return undefined / [] etc as appropriate.
// They don't check the arguments for validity therefore the frame methods should.

module.exports = {

	distance(arg1, arg2) {		// 2 ways to call:    distance(target_object)  |  distance(x, y)
		let x; let y;
		if (typeof arg1 === "object" && typeof arg2 === "undefined") {
			x = arg1.x; y = arg1.y;
		} else if (typeof arg1 === "number" && typeof arg2 === "number") {
			x = arg1; y = arg2;
		} else {
			throw "bad call";
		}
		return Math.abs(x - this.x) + Math.abs(y - this.y);
	},

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
		return this.frame.resources(type).sort((a, b) => this.distance(a) - this.distance(b))[0];
	},

	nearest_house(team) {
		return this.frame.houses_by_team(team).sort((a, b) => this.distance(a) - this.distance(b))[0];
	},

	nearest_needy_house(team) {
		return this.frame.houses_by_team(team).filter(house => house.needy()).sort((a, b) => this.distance(a) - this.distance(b))[0];
	},

	nearest_unit(team) {
		return this.frame.units_by_team(team).sort((a, b) => this.distance(a) - this.distance(b))[0];
	},

	annotate() {
		if (this.is_cell) {
			this.cmd.set(`dc ${this.x} ${this.y}`);
		} else {
			this.cell().annotate();
		}
	},

};

