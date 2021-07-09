import fs from "fs-extra";
import { BuilderState } from "..";
import { BuildOptions } from "../types/options";

export function makeEnvEntry(key: string, value: string) {
	return `${key}=${value}`;
}

export async function makeEnvFile(state: BuilderState, options: BuildOptions) {
	state.logger.writeIfVerbose("Constructing .env file");

	const envEntries = [];
	const initialToken = options.token.trim();
	const initialPrefix = options.prefix.trim();

	const finalToken =
		initialToken.length === 0 ? "ENTER_YOUR_BOT_TOKEN" : initialToken;

	const finalPrefix = initialPrefix.length === 0 ? "!" : initialPrefix;

	envEntries.push(
		makeEnvEntry("TOKEN", finalToken),
		makeEnvEntry("PREFIX", finalPrefix),
	);

	await fs.outputFile(state.paths.dotenv, envEntries.join("\n") + "\n");
}
