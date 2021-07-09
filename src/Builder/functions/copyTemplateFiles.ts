import fs from "fs-extra";
import path from "path";
import { BuilderState } from "..";
import { TEMPLATE_DIR } from "../../Shared/constants/paths";
import { InitMode } from "../impl/enums";
import { BuildOptions } from "../types/options";

async function buildTSProject(state: BuilderState, _: BuildOptions) {
	state.logger.write("Building... (happens only on typescript projects)");

	await state.shellStrict("tsc");
}

export async function copyTemplateFiles(
	state: BuilderState,
	options: BuildOptions,
) {
	state.logger.writeIfVerbose("Copying template files");

	/* Copy neccessary files */
	await fs.copy(path.join(TEMPLATE_DIR, options.language), state.cwd);

	/* Building project (if it is a typescript project) */
	if (options.language === InitMode.TS) {
		await buildTSProject(state, options);
	}
}
