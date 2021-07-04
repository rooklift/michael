"use strict";

const object_prototype = require("./__object_prototype");
const new_command_holder = require("./__command_holder");

function new_house(frame, team, id, x, y, cd) {

	let house = Object.create(house_prototype);
	Object.assign(house, {frame, team, id, x, y, cd});
	house.cmd = new_command_holder();
	return house;

}

let house_prototype = Object.assign(Object.create(object_prototype), {

	is_house: true,

	city() {
		return this.frame.city_by_id(this.id);
	},

	needy() {
		return !this.city().will_survive_night();
	},

	order_worker() {
		this.cmd.set(`bw ${this.x} ${this.y}`);
	},

	order_cart() {
		this.cmd.set(`bc ${this.x} ${this.y}`);
	},

	order_research() {
		this.cmd.set(`r ${this.x} ${this.y}`);
	},

});



module.exports = new_house;
