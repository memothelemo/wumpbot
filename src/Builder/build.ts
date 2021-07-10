import kleur from "kleur";
import { commitGitRepo } from "./functions/commitGitRepo";
import { copyTemplateFiles } from "./functions/copyTemplateFiles";
import { initializeGit } from "./functions/initializeGit";
import { installDevDependents } from "./functions/installDevDependents";
import { makeEnvFile } from "./functions/makeEnvFile";
import { makeESLintConfig } from "./functions/makeESLintConfig";
import { makeESLintIgnore } from "./functions/makeESLintIgnore";
import { makeGitIgnoreFile } from "./functions/makeGitIgnoreFile";
import { makePackage } from "./functions/makePackage";
import { BuilderState } from "./state";
import { BuildOptions } from "./types/options";

const STAGES = [
	makePackage,
	initializeGit,
	makeGitIgnoreFile,
	installDevDependents,
	makeESLintConfig,
	makeESLintIgnore,
	makeEnvFile,
	copyTemplateFiles,
	commitGitRepo,
];

function afterBuildProject(state: BuilderState, options: BuildOptions) {
	/* Constructing a paragraph */
	const paragraph = [
		"",
		"Your new bot is now ready for testing and coding!",
		"To get your bot online, type:",
		`${kleur.yellow("npm run start")}`,
	].join("\n");

	/* Informing users that building process is now done */
	state.logger.write("Done!");

	console.log(paragraph);
}

export async function buildProject(state: BuilderState, options: BuildOptions) {
	state.logger.write("Initializing project...");

	for (const stageFunc of STAGES) {
		await stageFunc(state, options);
	}

	afterBuildProject(state, options);
}
