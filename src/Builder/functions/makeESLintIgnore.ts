import fs from "fs-extra";
import { BuilderState } from "..";
import { TemplateConstants } from "../../Shared/constants/default";
import { BuildOptions } from "../types/options";

export async function makeESLintIgnore(
	state: BuilderState,
	options: BuildOptions,
) {
	if (!options.eslint) return;

	state.logger.writeIfVerbose("Constructing .eslintignore file");

	const output = TemplateConstants.ESLINT_IGNORE_ENTRIES.join("\n");
	await fs.outputFile(state.paths.eslintignore, output);
}
