module.exports = {
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
};
