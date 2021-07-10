import { BuilderState } from "../state";
import { BuildOptions } from "../types/options";

export async function initializeGit(
	state: BuilderState,
	options: BuildOptions,
) {
	if (!options.git) return;

	state.logger.writeIfVerbose("Making a git repository");

	/* Attempting to execute `git init` */
	await state.shellStrict("git init");
}
