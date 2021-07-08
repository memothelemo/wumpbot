import { Client } from "discord.js";
import { ExtendedClient } from "../typings/bot";
import { loadEvents } from "./Functions/loadEvents";
import { readCommands } from "./Functions/readCommands";

/* This is responsible for loading the .env file */
require("dotenv").config();

/* Creating new Discord bot */
const bot = new Client() as ExtendedClient;

/* Load commands */
bot.commands = readCommands("Commands");

/* Load events */
loadEvents(bot);

/* Logging in to Discord */
bot.login(process.env.BOT_TOKEN);
