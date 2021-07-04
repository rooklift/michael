"use strict";

const utils = require("./utils");

function new_house(frame, team, id, x, y, cd) {

	let house = Object.create(house_props);
	Object.assign(house, {frame, team, id, x, y, cd});
	house.cmd = "";
	return house;

}

let house_props = {

	is_house: true,

	distance(arg1, arg2) {
		return utils.distance_from_object(arg1, arg2);
	},

	cell() {
		return this.frame.map[this.x][this.y];
	},

	city() {
		return this.frame.get_city(this.id);
	},

	needy() {
		return !this.city().will_survive_night();
	}

};



module.exports = new_house;
