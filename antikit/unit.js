"use strict";

module.exports = function(frame, type, team, id, x, y, cd, wood, coal, uranium) {
	let unit = Object.create(unit_prototype);
	Object.assign(unit, {frame, type, team, id, x, y, cd, wood, coal, uranium});
	unit.cmd = {};
	return unit;
};

// ------------------------------------------------------------------------------------------------

let unit_prototype = Object.assign(Object.create(require("./__object_prototype")), {

	is_unit: true,

	weight() {
		return this.wood + this.coal + this.uranium;
	},

	order_move(d) {
		if (["n", "s", "e", "w", "c"].includes(d) === false) throw "bad call";
		this.command(`m ${this.id} ${d}`);
	},

	order_build() {
		this.command(`bcity ${this.id}`);
	},

	order_pillage() {
		this.command(`p ${this.id}`);
	},

	order_transfer(target, type, amount) {

		let tid;

		if (typeof target === "object" && target.is_unit) {
			tid = target.id;
		} else if (typeof target === "string") {
			tid = target;
		} else {
			throw "bad call";
		}

		this.command(`t ${this.id} ${tid} ${type} ${amount}`);
	},

});
