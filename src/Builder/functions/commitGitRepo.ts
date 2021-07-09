import { BuilderState } from "..";
import { BuildOptions } from "../types/options";

export async function commitGitRepo(
	state: BuilderState,
	options: BuildOptions,
) {
	if (!options.git) return;

	state.logger.writeIfVerbose("Commiting Git repo");
	state.logger.write("Finishing touches in this repository...");
	await state.shellStrict("git add .");
	await state.shellStrict(`git commit -a -m "Initial commit"`);
}
