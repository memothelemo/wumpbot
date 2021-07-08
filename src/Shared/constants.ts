import path from "path";

export const PACKAGE_ROOT = path.join(__dirname, "..", "..");
export const PKG_VERSION: string = require("../../package.json").version;
