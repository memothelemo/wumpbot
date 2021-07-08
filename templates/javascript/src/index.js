const { Client } = require("discord.js");

const readCommands = require("./Functions/readCommands");
const loadEvents = require("./Functions/loadEvents");

/* This is responsible for loading the .env file */
require("dotenv").config();

/* Creating new Discord bot */
const bot = new Client();

/* Load commands */
bot.commands = readCommands("Commands");

/* Load events */
loadEvents(bot);

/* Logging in to Discord */
bot.login(process.env.BOT_TOKEN);
