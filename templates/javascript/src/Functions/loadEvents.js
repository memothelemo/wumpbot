const fs = require("fs");
const path = require("path");

const config = require("../Constants/config");

module.exports = bot => {
	const pathToFolder = path.join(config.INTERNAL_DIR, "Events");
	const files = fs.readdirSync(path.join(pathToFolder));

	for (const file of files) {
		const pathToFile = path.join(pathToFolder, file);
		console.log(`Loading event file: ${pathToFile}`);

		const listener = require(pathToFile);
		bot.on(listener.event, (...args) => listener.callback(bot, ...args));
	}
};
