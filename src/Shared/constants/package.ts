import path from "path";

export const PACKAGE_ROOT = path.join(__dirname, "..", "..", "..");
export const PKG_VERSION: string = require(`../../../package.json`).version;

export const VERBOSE_MODE =
	process.env.NODE_ENV === "production" ? false : true;
