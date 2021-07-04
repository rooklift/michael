"use strict";

const object_prototype = require("./__object_prototype");

function new_house(frame, team, id, x, y, cd) {

	let house = Object.create(house_prototype);
	Object.assign(house, {frame, team, id, x, y, cd});
	house.cmd = {};
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
		this.command(`bw ${this.x} ${this.y}`);
	},

	order_cart() {
		this.command(`bc ${this.x} ${this.y}`);
	},

	order_research() {
		this.command(`r ${this.x} ${this.y}`);
	},

});



module.exports = new_house;
