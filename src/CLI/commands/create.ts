import yargs from "yargs";
import { executeInitCommand } from "../../Builder/cli-trigger";
import { InitMode, PackageManagers } from "../../Builder/impl/enums";
import { InitCLIOptions } from "../../Builder/types/options";
import { InitModesConstants } from "../../Shared/constants/modes";
import identity from "../../Shared/functions/identity";

export = identity<yargs.CommandModule<{}, InitCLIOptions>>({
	command: "create",
	describe: "Create a project",
	builder: () =>
		yargs
			.option("git", {
				boolean: true,
				describe: "Configure Git (requires Git cli to do this)",
			})
			.option("eslint", {
				boolean: true,
				describe: "Configure ESLint",
			})
			.option("prettier", {
				boolean: true,
				describe: "Configure Prettier",
			})
			.option("packageManager", {
				choices: Object.values(PackageManagers),
				describe:
					"Choose any packages available in npm and the package itself",
			})
			.command(InitMode.JS, InitModesConstants.JS_DESCRIPTION, {}, argv =>
				executeInitCommand(argv, InitMode.JS),
			)
			.command(InitMode.TS, InitModesConstants.TS_DESCRIPTION, {}, argv =>
				executeInitCommand(argv, InitMode.TS),
			),
	handler: argv => executeInitCommand(argv, InitMode.None),
});
