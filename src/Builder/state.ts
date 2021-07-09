import { exec, ExecException } from "child_process";
import fs from "fs-extra";
import kleur from "kleur";
import path from "path";
import { Logger } from "../Shared/classes/logger";
import { ErrorLogger } from "../Shared/constants/loggers";
import { VERBOSE_MODE } from "../Shared/constants/package";
import { loadRequiredProjectPaths } from "../Shared/constants/paths";
import { PackageManagerCommands } from "./impl/packageUtils";
import { BuildOptions } from "./types/options";

export class BuilderState {
	public paths = loadRequiredProjectPaths();
	public logger = new Logger("Builder", kleur.yellow, VERBOSE_MODE);
	public cwd = process.cwd();
	public options!: BuildOptions;
	public pkgManager!: PackageManagerCommands;

	public setOptions(options: BuildOptions) {
		this.options = options;
		this.pkgManager = PackageManagerCommands[this.options.packageManager!];
	}

	public error(reason: string) {
		ErrorLogger.write(reason);
		process.exit(1);
	}

	public shellStrict(line: string) {
		return new Promise<string>((resolve, reject) => {
			exec(line, (error, stdout) => {
				if (error) {
					reject(error);
				}
				return resolve(stdout);
			});
		}).catch((error: ExecException) => {
			throw new Error(
				`Command "${error.cmd}" exited with code ${error.code}\n\n"${error.message}"`,
			);
		});
	}

	public arePathsExists(): [boolean, string[]] {
		const existingPaths: string[] = [];
		for (const filePath of Object.values(this.paths)) {
			if (filePath && fs.pathExistsSync(filePath)) {
				const stat = fs.statSync(filePath);
				if (stat.isFile() || fs.readdirSync(filePath).length > 0) {
					existingPaths.push(path.relative(this.cwd, filePath));
				}
			}
		}
		return [existingPaths.length > 0, existingPaths];
	}
}
