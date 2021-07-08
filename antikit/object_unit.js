"use strict";

function new_unit(frame, type, team, id, x, y, cd, wood, coal, uranium) {
	return Object.assign(Object.create(unit_prototype), {frame, type, team, id, x, y, cd, wood, coal, uranium});
};

// ------------------------------------------------------------------------------------------------

let unit_prototype = Object.assign(Object.create(require("./object")), {

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

	next_cell() {

		if (this.cd === 0 && this.__cmd && this.__cmd.startsWith("m ")) {
			try {
				if (this.__cmd.endsWith(" c")) return this.frame.map[this.x][this.y];
				if (this.__cmd.endsWith(" e")) return this.frame.map[this.x + 1][this.y];
				if (this.__cmd.endsWith(" w")) return this.frame.map[this.x - 1][this.y];
				if (this.__cmd.endsWith(" n")) return this.frame.map[this.x][this.y - 1];
				if (this.__cmd.endsWith(" s")) return this.frame.map[this.x][this.y + 1];
			} catch (err) {
				// Failed because out of bounds.
			}
		}
		return this.frame.map[this.x][this.y];
	},

});

// ------------------------------------------------------------------------------------------------

module.exports = new_unit;
