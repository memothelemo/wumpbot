const path = require("path");

const PACKAGE_ROOT = path.join(__dirname, "..", "..");
const INTERNAL_DIR = path.join(PACKAGE_ROOT, "src");

module.exports = {
	PACKAGE_ROOT: PACKAGE_ROOT,
	INTERNAL_DIR: INTERNAL_DIR,
};
