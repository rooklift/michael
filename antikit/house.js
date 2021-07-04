"use strict";

const object_prototype = require("./__object_prototype");

function new_house(frame, team, id, x, y, cd) {

	let house = Object.create(house_prototype);
	Object.assign(house, {frame, team, id, x, y, cd});
	house.cmd = "";
	return house;

}

let house_prototype = Object.assign(Object.create(object_prototype), {

	is_house: true,

	city() {
		return this.frame.get_city_by_id(this.id);
	},

	needy() {
		return !this.city().will_survive_night();
	}

});



module.exports = new_house;
