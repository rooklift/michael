"use strict";

function new_unit(frame, type, team, id, x, y, cd, wood, coal, uranium) {
	return Object.assign(Object.create(unit_prototype), {frame, type, team, id, x, y, cd, wood, coal, uranium});
}

// ------------------------------------------------------------------------------------------------

let unit_prototype = Object.assign(Object.create(require("./object")), {

	is_unit: true,

	weight() {
		return this.wood + this.coal + this.uranium;
	},

	fuel() {
		return this.wood + (this.coal * 5) + (this.uranium * 25);
	},

	order_move(d) {
		if (["n", "s", "e", "w", "c"].includes(d) === false) throw "bad call";
		this.set_command(`m ${this.id} ${d}`);
	},

	order_build() {
		this.set_command(`bcity ${this.id}`);
	},

	order_pillage() {
		this.set_command(`p ${this.id}`);
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

		this.set_command(`t ${this.id} ${tid} ${type} ${amount}`);
	},

	next_cell() {

		let cmd = this.get_command();

		if (this.cd === 0 && cmd.startsWith("m ")) {
			try {
				if (cmd.endsWith(" e")) return this.frame.map[this.x + 1][this.y];
				if (cmd.endsWith(" w")) return this.frame.map[this.x - 1][this.y];
				if (cmd.endsWith(" n")) return this.frame.map[this.x][this.y - 1];
				if (cmd.endsWith(" s")) return this.frame.map[this.x][this.y + 1];
			} catch (err) {
				// Failed because out of bounds.
			}
		}

		return this.frame.map[this.x][this.y];
	},

});

// ------------------------------------------------------------------------------------------------

module.exports = new_unit;
