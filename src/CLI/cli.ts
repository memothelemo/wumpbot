import yargs from "yargs";
import { PACKAGE_ROOT, PKG_VERSION } from "../Shared/constants/package";

yargs
	/* Help */
	.usage("Discord bot template creator")
	.help("help")
	.alias("h", "help")
	.describe("help", "Shows help information and commands list")

	/* Version */
	.version(PKG_VERSION)
	.alias("v", "version")
	.describe("version", "Shows version information")

	/* Load commands */
	.commandDir(`${PACKAGE_ROOT}/out/CLI/commands`)

	/* Options */
	.recommendCommands()
	.strict()
	.wrap(yargs.terminalWidth())

	/* Execution */
	.fail((_, e: unknown) => {
		throw new Error(e as string);
	})
	.parse();
