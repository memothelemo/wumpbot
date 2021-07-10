import prompts from "prompts";
import yargs from "yargs";
import { CLIErrors, ErrorLogger } from "../Shared/constants/loggers";
import { getExisitingPkgMngrs } from "../Shared/functions/getExistingPkgMngrs";
import { buildProject } from "./build";
import { InitMode, PackageManagers } from "./impl/enums";
import { BuilderState } from "./state";
import { InitCLIOptions } from "./types/options";

async function promptProjectConfig(options: InitCLIOptions) {
	const pkgMngrsExistance = await getExisitingPkgMngrs();
	const pkgMngrsCount = Object.values(pkgMngrsExistance).filter(
		exists => exists,
	).length;

	return await prompts([
		{
			type: () => options.git === undefined && "confirm",
			name: "git",
			message: "Configure Git (requires Git CLI)",
			initial: true,
		},
		{
			type: () => options.eslint === undefined && "confirm",
			name: "eslint",
			message: "Configure ESLint",
			initial: true,
		},
		{
			type: (_, values) =>
				(options.eslint || values.eslint) &&
				options.prettier === undefined &&
				"confirm",
			name: "prettier",
			message: "Configure Prettier",
			initial: true,
		},
		{
			type: () => "password",
			name: "token",
			message: "Enter your bot token or press `enter` to ignore",
		},
		{
			type: () => "text",
			name: "prefix",
			message: "Enter your preferred prefix for your bot",
		},
		{
			type: () =>
				options.packageManager === undefined &&
				pkgMngrsCount > 1 &&
				"select",
			name: "packageManager",
			message:
				"Multiple package managers detected. Select package manager:",
			choices: Object.entries(PackageManagers)
				.filter(
					([_, packageManager]) => pkgMngrsExistance[packageManager],
				)
				.map(([displayName, value]) => ({
					title: displayName,
					value: value,
				})),
		},
	]);
}

function promptProgrammingLanguage() {
	return prompts({
		type: "select",
		name: "language",
		message: "Select your preferred programming language",
		choices: [InitMode.JS, InitMode.TS].map(value => ({
			title: value,
			value,
		})),
		initial: 0,
	});
}

export async function executeInitCommand(
	argv: yargs.Arguments<InitCLIOptions>,
	mode: InitMode,
) {
	/* Start a new build state */
	const state = new BuilderState();

	/* Detecting existing paths */
	const [arePathsExists, paths] = state.arePathsExists();
	if (arePathsExists) {
		return ErrorLogger.write(
			CLIErrors.OVERRIDE_PATHS(
				paths.map(path => `    - ${path}`).join("\n"),
			),
		);
	}

	/* Prompting users to choose their preferred programming languages */
	if (mode === InitMode.None) {
		mode = (await promptProgrammingLanguage()).language;

		/* ctrl+c or command interruption */
		if (mode === undefined) {
			return ErrorLogger.write("Interrupted by user");
		}
	}

	/* Choose their desired options */
	const opt = await promptProjectConfig(argv);

	/* Setting configured through the state */
	state.setOptions({
		git: opt.git,
		eslint: opt.eslint,
		prettier: opt.prettier,
		token: opt.token,
		prefix: opt.prefix,
		packageManager: opt.packageManager,
		language: mode,
	});

	buildProject(state, state.options);
}
