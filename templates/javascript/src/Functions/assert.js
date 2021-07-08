/**
 * Because JavaScript doesn't detect any
 * typing mistakes, I have to make an assert
 * function to avoid bugs
 */
module.exports = (value, text) => {
	if (typeof text !== "string") {
		throw new Error("`Text` parameter is not a string");
	}

	if (value != null || value !== false) {
		return;
	}

	throw new Error(text);
};
