import { InitMode, PackageManagers } from "../impl/enums";

export interface BuildOptions extends InitCLIOptions {
	token: string;
	prefix: string;
	language: InitMode;
}

export interface InitCLIOptions {
	git?: boolean;
	prettier?: boolean;
	eslint?: boolean;
	packageManager?: PackageManagers;
}
