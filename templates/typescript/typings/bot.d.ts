import {
	Client,
	Channel,
	PartialDMChannel,
	GuildEmoji,
	Guild,
	User,
	GuildMember,
	Collection,
	Snowflake,
	CloseEvent,
	TextChannel,
	PartialGuildMember,
	Speaking,
	PartialMessage,
	Presence,
	RateLimitData,
	Role,
	VoiceState,
	Message,
	ClientEvents,
} from "discord.js";

/** Member permissions */
type ValidPermissions =
	| "CREATE_INSTANT_INVITE"
	| "KICK_MEMBERS"
	| "BAN_MEMBERS"
	| "ADMINISTRATOR"
	| "MANAGE_CHANNELS"
	| "MANAGE_GUILD"
	| "ADD_REACTIONS"
	| "VIEW_AUDIT_LOG"
	| "PRIORITY_SPEAKER"
	| "STREAM"
	| "VIEW_CHANNEL"
	| "SEND_MESSAGES"
	| "SEND_TTS_MESSAGES"
	| "MANAGE_MESSAGES"
	| "EMBED_LINKS"
	| "ATTACH_FILES"
	| "READ_MESSAGE_HISTORY"
	| "MENTION_EVERYONE"
	| "USE_EXTERNAL_EMOJIS"
	| "VIEW_GUILD_INSIGHTS"
	| "CONNECT"
	| "SPEAK"
	| "MUTE_MEMBERS"
	| "DEAFEN_MEMBERS"
	| "MOVE_MEMBERS"
	| "USE_VAD"
	| "CHANGE_NICKNAME"
	| "MANAGE_NICKNAMES"
	| "MANAGE_ROLES"
	| "MANAGE_WEBHOOKS"
	| "MANAGE_EMOJIS";

/** Listener function of that specific event */
interface Event<K extends keyof ClientEvents> {
	event: K;
	callback: (client: ExtendedClient, ...args: ClientEvents[K]) => void;
}

/**
 * Extended client type.
 *
 * Make sure you do this when you're referencing
 * a bot
 */
type ExtendedClient = Client & {
	commands: Collection<string, Command>;
};

/** Command type */
interface Command {
	expectedArgs: string;
	maxArgs?: number;
	minArgs: number;

	name: string;
	description: string;
	aliases: string[];
	execute: (message: Message, bot: ExtendedClient, text: string) => void;

	permissions: ValidPermissions[] | ValidPermissions;
	requiredRoles: string[];

	permissionError: string;
}
