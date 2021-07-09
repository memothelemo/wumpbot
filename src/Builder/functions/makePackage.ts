import fs from "fs-extra";
import { BuilderState } from "../state";
import { BuildOptions } from "../types/options";
import { InitMode } from "../impl/enums";

async function modifyPkgJson(state: BuilderState, options: BuildOptions) {
	const pkgJSON = await fs.readJson(state.paths.packageJSON);
	if (options.language === InitMode.TS) {
		pkgJSON.scripts = {
			build: "tsc",
			watch: "tsc --w",
			start: "node .",
		};
		pkgJSON.main = "out/index.js";
	} else {
		pkgJSON.scripts = {
			start: "node .",
		};
		pkgJSON.main = "src/index.js";
	}
	return await fs.outputFile(
		state.paths.packageJSON,
		JSON.stringify(pkgJSON, null, 2),
	);
}

export async function makePackage(state: BuilderState, options: BuildOptions) {
	state.logger.writeIfVerbose(
		"Initializing package from configured package manager",
	);

	/* Initialize the project */
	await state.shellStrict(state.pkgManager.initProject);

	/* Modify changes to the package.json */
	await modifyPkgJson(state, options);
}
