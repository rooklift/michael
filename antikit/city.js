"use strict";

function new_city(frame, team, id, fuel, upkeep) {

	let city = Object.create(city_prototype);
	Object.assign(city, {frame, team, id, fuel, upkeep});
	return city;

}

let city_prototype = {

	is_city: true,

	will_survive_night() {
		return this.fuel >= this.upkeep * 10;
	}

	// FIXME - add houses() or somesuch
};



module.exports = new_city;
