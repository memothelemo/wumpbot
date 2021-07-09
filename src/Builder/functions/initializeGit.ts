import { ErrorLogger } from "../../Shared/constants/loggers";
import { BuilderState } from "../state";
import { BuildOptions } from "../types/options";

const GIT_CLI_NOT_INSTALLED =
	"Have you installed Git with CLI? Here's the link: 'https://git-scm.com/downloads'";

export async function initializeGit(
	state: BuilderState,
	options: BuildOptions,
) {
	if (!options.git) return;

	state.logger.writeIfVerbose("Making a git repository");

	/* Attempting to execute `git init` */
	await state.shellStrict("git init");
}
