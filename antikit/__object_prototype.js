"use strict";

// Common methods for cell, house, unit -- relies on them having:
//
//		this.frame
//		this.x
//		this.y

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
		return this.frame.get_house_at(this.x, this.y);			// possibly undefined
	},

	nearest_resource(type) {
		let list = this.frame.list_resources(type).sort((a, b) => {
			return this.distance(a) - this.distance(b);
		});
		return list[0];											// possibly undefined
	},

	nearest_house(team) {
		let list = this.frame.houses_by_team(team).sort((a, b) => {
			return this.distance(a) - this.distance(b);
		});
		return list[0];											// possibly undefined
	},

	nearest_needy_house(team) {
		let list = this.frame.houses_by_team(team).filter(house => house.needy()).sort((a, b) => {
			return this.distance(a) - this.distance(b);
		});
		return list[0];											// possibly undefined
	},

};
