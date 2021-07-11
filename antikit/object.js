"use strict";

const random = require("./random");
const utils = require("./utils");

// Prototype for cell, house, unit -- relies on them having:
//
//		this.frame
//		this.x
//		this.y
//
// Note that most of the getters can return undefined / [] etc as appropriate.

let object_prototype = {

	set_command(s) {
		this.__cmd = s;
	},

	get_command(s) {
		return this.__cmd || "";
	},

	cancel() {
		delete this.__cmd;
	},

	transmit() {
		if (this.__cmd) {
			console.log(this.__cmd);
		}
	},

	annotate() {
		if (this.is_cell) {
			this.set_command(`dc ${this.x} ${this.y}`);
		} else {
			this.cell().annotate();
		}
	},

	copy() {
		let ret = Object.create(Object.getPrototypeOf(this));
		for (let [key, value] of Object.entries(this)) {
			ret[key] = value;
		}
		return ret;
	},

	distance(dwim1, dwim2) {
		let [x, y] = utils.resolve_dwim_args(dwim1, dwim2);
		return Math.abs(x - this.x) + Math.abs(y - this.y);
	},

	choose(arr) {
		if (arr.length === 0) {
			return undefined;
		}
		let bests = [];
		let best_dist = Infinity;
		for (let o of arr) {
			let dist = this.distance(o);
			if (dist < best_dist) {
				bests = [o];
				best_dist = dist;
			} else if (dist === best_dist) {
				bests.push(o);
			}
		}
		return bests[Math.floor(random() * bests.length)];
	},

	cell() {
		return this.frame.map[this.x][this.y];
	},

	loc_string() {
		return `${this.x}|${this.y}`;
	},

	house() {
		return this.frame.house_at(this.x, this.y);
	},

	units() {
		return this.frame.units_at(this.x, this.y);
	},

	sorted_directions(dwim1, dwim2) {

		// Note that off-board moves won't be included at all.
		// Note that moving directly away is "not worse" than moving orthogonally, hmm.

		let [x, y] = utils.resolve_dwim_args(dwim1, dwim2);

		let better = [];
		let worse = [];

		if (this.x > 0) {							// Moving W is legal - but is it good or bad?
			if (this.x > x) { better.push("w"); } else { worse.push("w"); }
		}
		if (this.x < this.frame.width - 1) {		// Moving E is legal - but is it good or bad?
			if (this.x < x) { better.push("e"); } else { worse.push("e"); }
		}
		if (this.y > 0) {							// Moving N is legal - but is it good or bad?
			if (this.y > y) { better.push("n"); } else { worse.push("n"); }
		}
		if (this.y < this.frame.height - 1) {		// Moving S is legal - but is it good or bad?
			if (this.y < y) { better.push("s"); } else { worse.push("s"); }
		}

		utils.shuffle(better);
		utils.shuffle(worse);

		return better.concat(["c"]).concat(worse);
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

// ------------------------------------------------------------------------------------------------

module.exports = object_prototype;
