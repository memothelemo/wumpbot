import kleur from "kleur";
import { Logger } from "../classes/logger";
import { VERBOSE_MODE } from "./package";

export namespace CLIErrors {
	export const OVERRIDE_PATHS = (text: string) =>
		`Cannot initialize project, process could overwrite:\n${kleur.yellow(
			text,
		)}`;
}

export const ErrorLogger = new Logger("ERROR", kleur.red, VERBOSE_MODE);
export const WarningLogger = new Logger("WARNING", kleur.yellow);
