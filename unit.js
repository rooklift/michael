"use strict";

function new_unit(game, type, team, id, x, y, cd, wood, coal, uranium) {
	let unit = {game, type, team, id, x, y, cd, wood, coal, uranium};
	Object.assign(unit, unit_props);
	return unit;
}

let unit_props = {

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

	direction_to(a, b) {		// DWIM, accepts an object.

		let x; let y;

		if (typeof a === "object" && typeof b === "undefined") {
			x = a.x; y = a.y;
		} else if (typeof a === "number" && typeof b === "number") {
			x = a; y = b;
		} else {
			throw "bad call";
		}

		if (x === this.x && y === this.y) {
			return "c";
		}

		let dx_abs = Math.abs(this.x - x);
		let dy_abs = Math.abs(this.y - y);

		if (dx_abs > dy_abs) {
			return this.x - x > 0 ? "w" : "e";
		} else {
			return this.y - y > 0 ? "n" : "s";
		}
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

	direction_to_nearest_resource(type) {
		if (["wood", "coal", "uranium"].includes(type) === false) throw "bad call";
		let resource = this.nearest_resource(type);
		if (!resource) {
			return "c";
		}
		return this.direction_to(resource);
	},

	direction_to_nearest_house() {
		let house = this.nearest_house();
		if (!house) {
			return "c";
		}
		return this.direction_to(house);
	},

	weight() {
		return this.wood + this.coal + this.uranium;
	},
};



module.exports = new_unit;
