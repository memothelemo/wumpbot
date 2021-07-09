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

export async function buildProject(state: BuilderState, options: BuildOptions) {
	state.logger.write("Initializing project...");

	for (const stageFunc of STAGES) {
		await stageFunc(state, options);
	}
}
