"use strict";

const new_move_info = require("./move_info");

function new_unit(game, type, team, id, x, y, cd, wood, coal, uranium) {

	let unit = Object.create(unit_props);
	Object.assign(unit, {game, type, team, id, x, y, cd, wood, coal, uranium});
	return unit;

}

let unit_props = {

	is_unit: true,

	distance_to(a, b) {			// DWIM, accepts an object.

		let x; let y;

		if (typeof a === "object" && typeof b === "undefined") {
			x = a.x; y = a.y;
		} else if (typeof a === "number" && typeof b === "number") {
			x = a; y = b;
		} else {
			throw "bad call";
		}

		return Math.abs(x - this.x) + Math.abs(y - this.y);
	},

	move_towards(a, b) {		// DWIM, accepts an object. Returns a move_info object with {x1, y1, x2, y2, direction}

		let x; let y;

		if (typeof a === "object" && typeof b === "undefined") {
			x = a.x; y = a.y;
		} else if (typeof a === "number" && typeof b === "number") {
			x = a; y = b;
		} else {
			throw "bad call";
		}

		if (x === this.x && y === this.y) {
			return new_move_info(this.x, this.y, "c");
		}

		let dx_abs = Math.abs(this.x - x);
		let dy_abs = Math.abs(this.y - y);

		if (dx_abs > dy_abs) {
			return this.x - x > 0 ? new_move_info(this.x, this.y, "w") : new_move_info(this.x, this.y, "e");
		} else {
			return this.y - y > 0 ? new_move_info(this.x, this.y, "n") : new_move_info(this.x, this.y, "s");
		}
	},

	cell() {
		return this.game.map[this.x][this.y];
	},

	nearest_resource(type) {
		if (["wood", "coal", "uranium"].includes(type) === false) throw "bad call";
		let list = this.game.list_resources().filter(cell => cell.type === type).sort((a, b) => {
			return this.distance_to(a) - this.distance_to(b);
		});
		return list[0];			// possibly undefined
	},

	nearest_house() {
		let list = this.game.list_houses(this.team).sort((a, b) => {
			return this.distance_to(a) - this.distance_to(b);
		});
		return list[0];			// possibly undefined
	},

	nearest_needy_house() {
		let list = this.game.list_houses(this.team).filter(house => house.needy()).sort((a, b) => {
			return this.distance_to(a) - this.distance_to(b);
		});
		return list[0];			// possibly undefined
	},

	weight() {
		return this.wood + this.coal + this.uranium;
	},
};



module.exports = new_unit;
