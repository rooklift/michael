"use strict";

const utils = require("./utils");

function new_unit(frame, type, team, id, x, y, cd, wood, coal, uranium) {

	let unit = Object.create(unit_props);
	Object.assign(unit, {frame, type, team, id, x, y, cd, wood, coal, uranium});
	unit.cmd = "";
	return unit;

}

let unit_props = {

	is_unit: true,

	distance(arg1, arg2) {
		return utils.distance_from_object(arg1, arg2);
	},

	cell() {
		return this.frame.map[this.x][this.y];
	},

	nearest_resource(type) {
		let list = this.frame.list_resources(type).sort((a, b) => {
			return this.distance(a) - this.distance(b);
		});
		return list[0];			// possibly undefined
	},

	nearest_house() {
		let list = this.frame.list_houses(this.team).sort((a, b) => {
			return this.distance(a) - this.distance(b);
		});
		return list[0];			// possibly undefined
	},

	nearest_needy_house() {
		let list = this.frame.list_houses(this.team).filter(house => house.needy()).sort((a, b) => {
			return this.distance(a) - this.distance(b);
		});
		return list[0];			// possibly undefined
	},

	weight() {
		return this.wood + this.coal + this.uranium;
	},
};



module.exports = new_unit;
