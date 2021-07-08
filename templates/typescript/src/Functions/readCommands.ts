import { Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "../../typings/bot";
import { INTERNAL_DIR } from "../Constants/config";

export function readCommands(folder: string) {
	const pathToFolder = path.join(INTERNAL_DIR, folder);
	const files = fs.readdirSync(path.join(pathToFolder));
	const commands = new Collection() as Collection<string, Command>;

	for (const file of files) {
		const pathToFile = path.join(pathToFolder, file);
		console.log(`Loading file/directory: ${pathToFile}`);

		const stat = fs.statSync(pathToFile);

		if (stat.isDirectory()) {
			const registered = readCommands(path.join(folder, file));
			registered.forEach((v, k) => commands.set(k, v));
		} else {
			/* Load the command */
			const command = require(pathToFile) as Command;
			commands.set(command.name, command);
		}
	}

	return commands;
}
