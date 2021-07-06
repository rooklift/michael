"use strict";

const utils = require("./utils");

// Prototype for cell, house, unit -- relies on them having:
//
//		this.frame
//		this.x
//		this.y
//		this.cmd

module.exports = {

	command(s) {
		this.cmd.val = s;
	},

	cancel() {
		delete this.cmd.val;
	},

	transmit() {
		if (this.cmd.val) {
			send(this.cmd.val);
		}
	},

	annotate() {
		if (this.is_cell) {
			this.command(`dc ${this.x} ${this.y}`);
		} else {
			this.cell().annotate();
		}
	},

	distance(dwim1, dwim2) {
		let [x, y] = utils.resolve_dwim_args(dwim1, dwim2);
		return Math.abs(x - this.x) + Math.abs(y - this.y);
	},

	choose(arr) {
		if (arr.length === 0) {
			return undefined;
		}
		let ret = arr[0];
		let best_dist = this.distance(arr[0]);
		for (let o of arr.slice(1)) {
			let dist = this.distance(o);
			if (dist < best_dist) {
				ret = o;
				best_dist = dist;
			}
		}
		return ret;
	},

	// Note that most of the getters can return undefined / [] etc as appropriate.

	cell() {
		return this.frame.map[this.x][this.y];
	},

	house() {
		return this.frame.house_at(this.x, this.y);
	},

	units() {
		return this.frame.units_at(this.x, this.y);
	},

	naive_direction(dwim1, dwim2) {
		let [targetx, targety] = utils.resolve_dwim_args(dwim1, dwim2);
		let dx = targetx - this.x;
		let dy = targety - this.y;
		if (dx === 0 && dy === 0) {
			return "c";
		}
//		if (Math.abs(dx) === Math.abs(dy)) {		// Exactly diagonal, try to "turn" clockwise
//			if (dx < 0 && dy < 0) return "w";
//			if (dx > 0 && dy < 0) return "n";
//			if (dx > 0 && dy > 0) return "e";
//			if (dx < 0 && dy > 0) return "s";
//		}
		if (Math.abs(dx) > Math.abs(dy)) {
			return dx < 0 ? "w" : "e";
		} else {
			return dy < 0 ? "n" : "s";
		}
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
