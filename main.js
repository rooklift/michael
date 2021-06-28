"use strict";

const fs = require("fs");
const readline = require("readline");

const LOG = false;
const LOG_INPUT = false;
const LOG_OUTPUT = false;
const LOG_STATES = false;

// ------------------------------------------------------------------------------------------------

let bot = {

	startup: function() {
		this.linecount = -1;
		this.start_scan();
	},

	start_log: function(filename) {
		if (!LOG) {
			return;
		}
		this.logstream = fs.createWriteStream(filename, {flags: "a"});
		this.log("==============================================================================");
		this.log(`Michael startup at ${new Date().toUTCString()}`);
	},

	start_scan: function() {
		this.scanner = readline.createInterface({
			input: process.stdin,
			output: undefined,
			terminal: false
		});
		this.scanner.on("line", (line) => {
			this.linecount++;
			this.handle_line(line, this.linecount);
		});
	},

	// --------------------------------------------------------------------------------------------

	send: function(s) {
		console.log(s);
		if (LOG_OUTPUT) this.log("> " + s);
	},

	log: function(s) {
		if (!LOG || !this.logstream) {
			return;
		}
		this.logstream.write(s);
		this.logstream.write("\n");
	},

	// --------------------------------------------------------------------------------------------

	handle_line: function(s, lineno) {

		if (LOG_INPUT) this.log("< " + s);
		let fields = s.split(" ");

		// The first 2 lines we ever receive are special...

		if (lineno === 0) {
			this.team = parseInt(fields[0], 10);
			this.start_log(`michael_${this.team}.log`);
			if (LOG_INPUT) this.log("< " + s);
			return;
		}

		if (lineno === 1) {
			let width = parseInt(fields[0], 10);
			let height = parseInt(fields[1], 10);
			this.state = NewGameState(width, height);
			return;
		}

		if (fields[0] === "c") {				// c t city_id f lk

			let team = parseInt(fields[1], 10);
			let id = fields[2];
			let fuel = parseInt(fields[3], 10);
			let lk = parseInt(fields[4], 10);

			this.state.cities.push({team, id, fuel, lk});
			return;
		}

		if (fields[0] === "ccd") {				// ccd x y cd

			let x = parseInt(fields[1], 10);
			let y = parseInt(fields[2], 10);
			let cd = parseInt(fields[3], 10);

			this.state.map[x][y].cd = cd;
			return;
		}

		if (fields[0] === "ct") {				// ct t city_id x y cd

			let team = parseInt(fields[1], 10);
			let id = fields[2];
			let x = parseInt(fields[3], 10);
			let y = parseInt(fields[4], 10);
			let cd = parseInt(fields[5], 10);

			this.state.tiles.push({team, id, x, y, cd});
			return;
		}

		if (fields[0] === "r") {				// r resource_type x y amount

			let type = fields[1][0];
			let x = parseInt(fields[2], 10);
			let y = parseInt(fields[3], 10);
			let val = parseInt(fields[4], 10);

			this.state.map[x][y].type = type;
			this.state.map[x][y].val = val;
			return;
		}

		if (fields[0] === "rp") {				// rp t points

			let team = parseInt(fields[1], 10);
			let points = parseInt(fields[2], 10);

			this.state.rp[team] = points;
			return;
		}

		if (fields[0] === "u") {				// u unit_type t unit_id x y cd w c u

			let type = parseInt(fields[1], 10);
			let team = parseInt(fields[2], 10);
			let id = fields[3];
			let x = parseInt(fields[4], 10);
			let y = parseInt(fields[5], 10);
			let cd = parseInt(fields[6], 10);
			let wood = parseInt(fields[7], 10);
			let coal = parseInt(fields[8], 10);
			let uranium = parseInt(fields[9], 10);

			this.state.units.push({type, team, id, x, y, cd, wood, coal, uranium});
			return;
		}

		if (fields[0] === "D_DONE") {
			if (LOG_STATES) {
				this.log(this.state.string());
				this.log("-".repeat(this.state.width));
			}
			this.ai();
			this.state.reset();					// Must reset the map for the next turn. (?)
			return;
		}

	},

	ai: function() {
		this.send("D_FINISH");
	},

};

// ------------------------------------------------------------------------------------------------

function NewGameState(width, height) {

	let game = Object.assign({}, game_state_props);

	game.width = width;
	game.height = height;
	game.map = [];

	for (let x = 0; x < width; x++) {
		game.map.push([]);
		for (let y = 0; y < height; y++) {
			game.map[x].push({});
		}
	}

	game.reset();
	return game;
}

let game_state_props = {

	reset: function() {

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.map[x][y].type = "";
				this.map[x][y].val = 0;
				this.map[x][y].cd = 1;		// Is this right? ccd is "only sent for any cells with cooldowns not equal to 1" -- logic.d.ts
			}
		}

		this.rp = [0, 0];
		this.units = [];
		this.cities = [];
		this.tiles = [];
	},

	string: function() {
		let lines = [];
		for (let y = 0; y < this.height; y++) {
			let line = [];
			for (let x = 0; x < this.width; x++) {
				line.push(this.map[x][y].type ? this.map[x][y].type : " ");
			}
			lines.push(line.join(""));
		}
		return lines.join("\n");
	},

};

// ------------------------------------------------------------------------------------------------

bot.startup();
