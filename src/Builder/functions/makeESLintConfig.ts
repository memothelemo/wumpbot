import fs from "fs-extra";
import { TemplateConstants } from "../../Shared/constants/default";
import identity from "../../Shared/functions/identity";
import { InitMode } from "../impl/enums";
import { BuilderState } from "../state";
import { BuildOptions } from "../types/options";

export async function makeESLintConfig(
	state: BuilderState,
	options: BuildOptions,
) {
	if (!options.eslint) return;

	state.logger.writeIfVerbose("Initializing ESLint");

	const eslintConfig = {
		env: {
			browser: true,
			commonjs: true,
			es2021: true,
		},
		parser: "",
		parserOptions: {},
		plugins: identity<string[]>([]),
		extends: identity<string[]>([]),
		rules: identity<{ [index: string]: unknown }>({}),
	};

	if (options.language === InitMode.TS) {
		eslintConfig.parser = "@typescript-eslint/parser";
		eslintConfig.plugins.push(
			"@typescript-eslint",
			"@typescript-eslint/eslint-plugin",
		);
		eslintConfig.extends.push("plugin:@typescript-eslint/recommended");
	}

	for (const rule of TemplateConstants.ESLINT_CONFIG_RULES) {
		eslintConfig.rules[rule] = "off";
	}

	if (options.prettier) {
		eslintConfig.plugins.push("prettier");
		eslintConfig.extends.push("plugin:prettier/recommended");
		eslintConfig.rules["prettier/prettier"] = [
			"warn",
			{
				arrowParens: "avoid",
				semi: true,
				trailingComma: "all",
				singleQuote: false,
				printWidth: 80,
				tabWidth: 4,
				useTabs: true,
			},
		];
	}

	await fs.outputFile(
		state.paths.eslintrc,
		JSON.stringify(eslintConfig, null, 4),
	);
}
