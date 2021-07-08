const { Collection } = require("discord.js");

const path = require("path");
const fs = require("fs");
const assert = require("./assert");

const config = require("../Constants/config");

function format(a, b) {
	return `Failed to load command: ${a}, because ${b}`;
}

function readCommands(folder) {
	const pathToFolder = path.join(config.INTERNAL_DIR, folder);
	const files = fs.readdirSync(path.join(pathToFolder));
	const commands = new Collection();

	for (const file of files) {
		const pathToFile = path.join(pathToFolder, file);
		console.log(`Loading file/directory: ${pathToFile}`);

		const stat = fs.statSync(pathToFile);

		if (stat.isDirectory()) {
			const registered = readCommands(path.join(folder, file));
			registered.forEach((v, k) => commands.set(k, v));
		} else {
			/* Validating command file */
			const command = require(pathToFile);

			assert(
				typeof command.name === "string",
				format(pathToFile, "`name` entry is not a string!"),
			);

			assert(
				typeof command.description === "string",
				format(pathToFile, "`description` entry must be a string!"),
			);

			assert(
				Array.isArray(command.aliases),
				format(pathToFile, "`aliases` entry must be an array!"),
			);

			assert(
				Array.isArray(command.permissions) ||
					typeof command.permissions === "string",
				format(
					pathToFile,
					"`permissions` entry must be an array or string!",
				),
			);

			assert(
				Array.isArray(command.requiredRoles),
				format(pathToFile, "`requiredRoles` entry must be an array"),
			);

			assert(
				typeof command.expectedArgs == "string",
				format(pathToFile, "`expectedArgs` entry must be a string!"),
			);

			assert(
				typeof command.permissionError == "string",
				format(pathToFile, "`permissionError` entry must be a string!"),
			);

			assert(
				typeof command.minArgs === "number",
				format(pathToFile, "`minArgs` entry must be a number!"),
			);

			assert(
				typeof command.maxArgs === "number" ||
					command.maxArgs === undefined,
				format(
					pathToFile,
					"`maxArgs` entry must be a number or undefined!",
				),
			);

			commands.set(command.name, command);
		}
	}

	return commands;
}

module.exports = readCommands;
