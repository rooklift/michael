"use strict";

// https://en.wikipedia.org/wiki/Linear_congruential_generator
// Just need something simple for the sake of breaking ties when choosing directions.

let val = 0;

module.exports = () => {
	val = (75 * val + 74) % 65537;
	return val / 65537;
};
