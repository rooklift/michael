"use strict";

const object_prototype = require("./__object_prototype");
const new_command_holder = require("./__command_holder");

function new_unit(frame, type, team, id, x, y, cd, wood, coal, uranium) {

	let unit = Object.create(unit_prototype);
	Object.assign(unit, {frame, type, team, id, x, y, cd, wood, coal, uranium});
	unit.cmd = new_command_holder();
	return unit;

}

let unit_prototype = Object.assign(Object.create(object_prototype), {

	is_unit: true,

	weight() {
		return this.wood + this.coal + this.uranium;
	},

	order_move(d) {
		if (["n", "s", "e", "w", "c"].includes(d) !== true) {
			throw "bad call";
		}
		this.cmd.set(`m ${this.id} d`);
	},

	order_build() {
		this.cmd.set(`bcity ${this.id}`);
	},

});




module.exports = new_unit;
