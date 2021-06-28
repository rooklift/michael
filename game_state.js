"use strict";

function new_game_state(width, height) {

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
		let lines = ["-".repeat(this.width)];
		for (let y = 0; y < this.height; y++) {
			let line = [];
			for (let x = 0; x < this.width; x++) {
				line.push(this.map[x][y].type ? this.map[x][y].type : " ");
			}
			lines.push(line.join(""));
		}
		lines.push("-".repeat(this.width));
		return lines.join("\n");
	},

};



module.exports = new_game_state;
