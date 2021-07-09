import fs from "fs-extra";
import { BuilderState } from "..";
import { TemplateConstants } from "../../Shared/constants/default";
import { BuildOptions } from "../types/options";

export async function makeGitIgnoreFile(
	state: BuilderState,
	options: BuildOptions,
) {
	if (!options.git) return;

	state.logger.writeIfVerbose("Writing .gitignore file");
	await fs.outputFile(
		state.paths.gitignore,
		TemplateConstants.GIT_IGNORE_ENTRIES.join("\n") + "\n",
	);
}
