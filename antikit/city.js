"use strict";

function new_city(frame, team, id, fuel, lk) {

	let city = Object.create(city_props);
	Object.assign(city, {frame, team, id, fuel, lk});
	return city;

}

let city_props = {

	is_city: true,

	will_survive_night() {
		return this.fuel >= this.lk * 10;
	}
};



module.exports = new_city;
