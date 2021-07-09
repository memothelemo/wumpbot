import path from "path/posix";
import { PACKAGE_ROOT } from "./package";

export const TEMPLATE_DIR = path.join(PACKAGE_ROOT, "templates");

export const loadRequiredProjectPaths = () => {
	const cwd = process.cwd();
	return {
		dotenv: path.join(cwd, ".env"),
		eslintignore: path.join(cwd, ".eslintignore"),
		eslintrc: path.join(cwd, ".eslintrc.json"),
		gitignore: path.join(cwd, ".gitignore"),
		packageJSON: path.join(cwd, "package.json"),
		packageLock: path.join(cwd, "package-lock.json"),
		src: path.join(cwd, "src"),
		tsconfig: path.join(cwd, "tsconfig.json"),
	} as const;
};
