import { PackageManagers } from "./enums";

export interface PackageManagerCommands {
	initProject: string;
	devInstall: string;
	install: string;
}

export const PackageManagerCommands: Record<
	PackageManagers,
	PackageManagerCommands
> = {
	[PackageManagers.NPM]: {
		initProject: "npm init -y",
		devInstall: "npm install -D",
		install: "npm install",
	},
	[PackageManagers.Yarn]: {
		initProject: "yarn init -y",
		devInstall: "yarn add -D",
		install: "yarn add",
	},
	[PackageManagers.PNPM]: {
		initProject: "pnpm init -y",
		devInstall: "pnpm add --D",
		install: "pnpm add",
	},
};
