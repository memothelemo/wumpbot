import { lookpath } from "lookpath";
import { PackageManagers } from "../../Builder/impl/enums";

export async function getExisitingPkgMngrs(): Promise<
	Record<PackageManagers, boolean>
> {
	return {
		[PackageManagers.NPM]: true, // obviously
		[PackageManagers.Yarn]: (await lookpath("yarn")) ? true : false,
	};
}
