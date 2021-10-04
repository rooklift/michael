	finish_parse() {								// At this point, we could add stuff like cached arrays of the various resources etc.
		this.__freeze_recurse(this);				// We might also want to not freeze things, adding properties to units could be useful.
	},

	__freeze_recurse(o) {		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze

		for (let key of Object.getOwnPropertyNames(o)) {

			if (key === "frame") {
				continue;							// Avoid infinite circular recursion.
			}

			if (key === "cmd") {
				continue;							// We need to be able to alter these.
			}

			let value = o[key];

			if (typeof value === "object" && value !== null) {
				this.__freeze_recurse(value);
			}
		}

		Object.freeze(o);
	},
