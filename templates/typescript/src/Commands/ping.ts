import { Command } from "../../typings/bot";
import { identity } from "../Functions/identity";

export = identity<Command>({
	name: "Ping",
	description: "Testing command for bots",
	aliases: ["ping"],

	expectedArgs: "",
	minArgs: 0,

	execute: message => {
		message.channel.send("Pong!");
	},
	permissions: [],
	requiredRoles: [],
	permissionError: "",
});
