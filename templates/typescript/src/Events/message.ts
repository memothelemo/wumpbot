import { Guild, GuildMember, Message } from "discord.js";
import { Command, Event, ExtendedClient } from "../../typings/bot";
import { identity } from "../Functions/identity";

function isAliasMatched(content: string, alias: string): boolean {
    return content
        .toLowerCase()
        .startsWith(`${process.env.PREFIX}${alias.toLowerCase()}`);
}

function hasPermissions(member: GuildMember | null, command: Command) {
    if (typeof command.permissions === "string") {
        return member!.hasPermission(command.permissions);
    }

    for (const permission of command.permissions) {
        if (!member!.hasPermission(permission)) {
            return false;
        }
    }

    return true;
}

function hasRequiredRole(member: GuildMember, command: Command, guild: Guild) {
    for (const requiredRole of command.requiredRoles) {
        const role = guild.roles.cache.find(role => role.name === requiredRole);

        if (!role || member.roles.cache.has(role.id)) {
            return [false, requiredRole];
        }
    }

    return [true];
}

function doCommands(bot: ExtendedClient, message: Message) {
    const { member, content, guild } = message;

    /* Do not accept commands if the member isn't replying inside the guild */
    if (!guild) return;

    /* Do not accept if member is null */
    if (!member) return;

    bot.commands.forEach(command =>
        command.aliases.forEach(alias => {
            /* Checking if every aliases are matched */
            if (!isAliasMatched(content, alias)) return;

            /* Ensure the user has the required permissions */
            if (!hasPermissions(member, command)) {
                return message.reply(command.permissionError);
            }

            /* Ensure the user has the required roles */
            const [hasRole, requiredRole] = hasRequiredRole(
                member,
                command,
                guild,
            );

            if (!hasRole) {
                return message.reply(
                    `You must have the ${requiredRole} role to use this command.`,
                );
            }

            /* Split on any number of spaces */
            const args = content.split(/[ ]+/);

            /* Remove the command which is the first index */
            args.shift();

            /* Ensure that command's arguments are correct */
            if (
                args.length < command.minArgs ||
                (command.maxArgs !== undefined && args.length > command.maxArgs)
            ) {
                return message.reply(
                    `Incorrect syntax! Use ${process.env.PREFIX}${alias}${command.expectedArgs}`,
                );
            }

            /* Handle the custom command code */
            command.execute(message, bot, args.join(" "));
        }),
    );
}

export = identity<Event<"message">>({
    event: "message",
    callback: (bot, message) => {
        return doCommands(bot, message);
    },
});
