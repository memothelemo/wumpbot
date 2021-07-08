import { ClientEvents } from "discord.js";
import fs from "fs";
import path from "path";
import { ExtendedClient, Event } from "../../typings/bot";
import { INTERNAL_DIR } from "../Constants/config";

export function loadEvents(bot: ExtendedClient) {
	const pathToFolder = path.join(INTERNAL_DIR, "Events");
	const files = fs.readdirSync(path.join(pathToFolder));

	for (const file of files) {
		const pathToFile = path.join(pathToFolder, file);
		console.log(`Loading event file: ${pathToFile}`);

		const listener = require(pathToFile) as Event<keyof ClientEvents>;
		bot.on(listener.event, (...args) => listener.callback(bot, ...args));
	}
}
