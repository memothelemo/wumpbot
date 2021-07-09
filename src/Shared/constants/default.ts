export class TemplateConstants {
	public static GIT_IGNORE_ENTRIES = ["/node_modules", "/out", "*.env"];
	public static ESLINT_IGNORE_ENTRIES = ["node_modules", "out"];
	public static ESLINT_CONFIG_RULES = [
		"@typescript-eslint/no-unused-vars",
		"@typescript-eslint/explicit-function-return-type",
		"@typescript-eslint/interface-name-prefix",
		"@typescript-eslint/no-empty-function",
		"@typescript-eslint/no-empty-interface",
		"@typescript-eslint/no-namespace",
		"@typescript-eslint/no-non-null-assertion",
		"@typescript-eslint/no-use-before-define",
		"@typescript-eslint/explicit-module-boundary-types",
		"@typescript-eslint/no-var-requires",
		"@typescript-eslint/no-unused-expressions",
	];
}
