import { InitMode } from "../impl/enums";
import { BuilderState } from "../state";
import { BuildOptions } from "../types/options";

const devDependencies = (options: BuildOptions) => {
	const deps = ["discord.js", "dotenv"];
	if (options.language === InitMode.TS) {
		deps.push("@types/dotenv", "@types/node");
	}
	if (options.eslint) {
		deps.push("eslint");
		if (options.language === InitMode.TS) {
			deps.push(
				"typescript",
				"@typescript-eslint/eslint-plugin",
				"@typescript-eslint/parser",
			);
		}
		if (options.prettier) {
			deps.push(
				"prettier",
				"eslint-config-prettier",
				"eslint-plugin-prettier",
			);
		}
	}
	if (options.nodemon) {
		deps.push("nodemon");
	}
	return deps.join(" ");
};

export async function installDevDependents(
	state: BuilderState,
	options: BuildOptions,
) {
	state.logger.writeIfVerbose("Installing required package dependents");

	/* Get required dependencies depending on configuration */
	const dependenciesStr = devDependencies(options);
	const cmd = `${state.pkgManager.devInstall} ${dependenciesStr}`;

	await state.shellStrict(cmd);
}
