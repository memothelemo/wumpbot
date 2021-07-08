import chalk from "chalk";
import { exec, ExecException } from "child_process";
import fs from "fs-extra";
import path from "path/posix";
import prompts from "prompts";
import yargs from "yargs";
import { PACKAGE_ROOT } from "../../Shared/constants";
import { identity } from "../../Shared/functions";

interface InitOptions {
    git?: boolean;
    prettier?: boolean;
    eslint?: boolean;
}

enum InitMode {
    None = "none",
    JS = "javascript",
    TS = "typescript",
}

enum PackageManager {
    NPM = "npm",
}

interface PackageManagerCommands {
    init: string;
    devInstall: string;
    install: string;
}

const packageManagerCommands: Record<PackageManager, PackageManagerCommands> = {
    [PackageManager.NPM]: {
        init: "npm init -y",
        devInstall: "npm install -D",
        install: "npm install",
    },
};

const TEMPLATE_DIR = path.join(PACKAGE_ROOT, "templates");
const GIT_IGNORE = ["/node_modules", "/out", "*.env"];
const ESLINT_CUSTOM_RULES = [
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
const ESLINT_IGNORE_ENTRIES = ["node_modules", "out"];

function shell(cmdStr: string) {
    return new Promise<string>((resolve, reject) => {
        exec(cmdStr, (error, stdout) => {
            if (error) {
                reject(error);
            }
            resolve(stdout);
        });
    }).catch((error: ExecException) => {
        throw new Error(
            `Command "${error.cmd} exited with code ${error.code}\n\n${error.message}"`,
        );
    });
}

async function init(argv: yargs.Arguments<InitOptions>, mode: InitMode) {
    const cwd = process.cwd();
    const paths = {
        dotEnv: path.join(cwd, ".env"),
        eslintignore: path.join(cwd, ".eslintignore"),
        eslintrc: path.join(cwd, ".eslintrc.json"),
        gitIgnore: path.join(cwd, ".gitignore"),
        packageDotJSON: path.join(cwd, "package.json"),
        packageLockDotJSON: path.join(cwd, "package-lock.json"),
        src: path.join(cwd, "src"),
        tsconfig: path.join(cwd, "tsconfig.json"),
    };

    /* Detecting existing paths */
    const exisitingPaths: string[] = [];
    for (const filePath of Object.values(paths)) {
        if (filePath && (await fs.pathExists(filePath))) {
            const stat = await fs.stat(filePath);
            if (stat.isFile() || (await fs.readdir(filePath)).length > 0) {
                exisitingPaths.push(path.relative(cwd, filePath));
            }
        }
    }

    if (exisitingPaths.length > 0) {
        const pathInfo = exisitingPaths
            .map(v => `  - ${chalk.yellowBright(v)}\n`)
            .join("");
        return console.log(
            `[${chalk.redBright(
                "ERROR",
            )}]: Cannot initialize project, process could overwrite:\n${pathInfo}`,
        );
    }

    /* Prompting users to choose specific programming languages */
    if (mode === InitMode.None) {
        mode = (
            await prompts({
                type: "select",
                name: "language",
                message: "Select programming languages",
                choices: [InitMode.JS, InitMode.TS].map(value => ({
                    title: value,
                    value,
                })),
                initial: 0,
            })
        ).language;

        /* ctrl+c */
        if (mode === undefined) {
            return;
        }
    }

    const {
        git = argv.git ?? false,
        eslint = argv.eslint ?? false,
        prettier = argv.prettier ?? false,
        token = "",
        prefix = "!",
    }: {
        git: boolean;
        eslint: boolean;
        prettier: boolean;
        token: string;
        prefix: string;
    } = await prompts([
        {
            type: () => argv.git === undefined && "confirm",
            name: "git",
            message: "Configure Git (requires Git CLI)",
            initial: true,
        },
        {
            type: () => argv.eslint === undefined && "confirm",
            name: "eslint",
            message: "Configure ESLint",
            initial: true,
        },
        {
            type: (_, values) =>
                (argv.eslint || values.eslint) &&
                argv.prettier === undefined &&
                "confirm",
            name: "prettier",
            message: "Configure Prettier",
            initial: true,
        },
        {
            type: () => "password",
            name: "token",
            message: "Enter your bot token or press `enter` to ignore",
        },
        {
            type: () => "text",
            name: "prefix",
            message: "Enter your preferred prefix for your bot",
        },
    ]);

    /* ctrl+c verification */
    if (git === undefined || prettier === undefined || eslint === undefined) {
        return;
    }

    console.log("Initializing project...");
    const selectedPackageManager = packageManagerCommands[PackageManager.NPM];
    await shell(selectedPackageManager.init);

    const pkgJSON = await fs.readJson(paths.packageDotJSON);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (mode === InitMode.TS) {
        pkgJSON.scripts = {
            build: "tsc",
            watch: "tsc --w",
            start: "node .",
        };

        pkgJSON.main = "out/index.js";
    } else {
        pkgJSON.scripts = {
            start: "node .",
        };
        pkgJSON.main = "src/index.js";
    }

    await fs.outputFile(paths.packageDotJSON, JSON.stringify(pkgJSON, null, 2));

    /* git */
    if (git) {
        try {
            await shell("git init");
            await fs.outputFile(paths.gitIgnore, GIT_IGNORE.join("\n") + "\n");
        } catch {
            throw new Error(
                "Have you installed Git with CLI? Here's the link: 'https://git-scm.com/downloads'",
            );
        }
    }

    /* dev dependencies */
    const devDependencies = ["discord.js", "dotenv"];

    if (mode === InitMode.TS) {
        devDependencies.push("@types/dotenv", "@types/node");
    }

    if (eslint) {
        devDependencies.push("eslint");
        if (mode === InitMode.TS) {
            devDependencies.push(
                "typescript",
                "@typescript-eslint/eslint-plugin",
                "@typescript-eslint/parser",
            );
        }
        if (prettier) {
            devDependencies.push(
                "prettier",
                "eslint-config-prettier",
                "eslint-plugin-prettier",
            );
        }
    }

    await shell(
        `${selectedPackageManager.devInstall} ${devDependencies.join(" ")}`,
    );

    /* create eslint file */
    if (eslint) {
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

        if (mode === InitMode.TS) {
            eslintConfig.parser = "@typescript-eslint/parser";
            eslintConfig.plugins.push(
                "@typescript-eslint",
                "@typescript-eslint/eslint-plugin",
            );
            eslintConfig.extends.push("plugin:@typescript-eslint/recommended");
        }

        for (const rule of ESLINT_CUSTOM_RULES) {
            eslintConfig.rules[rule] = "off";
        }

        if (prettier) {
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

        await fs.outputFile(paths.eslintrc, JSON.stringify(eslintConfig));
    }

    /* eslintingore */
    await fs.outputFile(paths.eslintignore, ESLINT_IGNORE_ENTRIES.join("\n"));

    /* create .env file */
    const envEntries = [];
    const finalToken = token.trim();
    const finalPrefix = prefix.trim();

    envEntries.push(
        `BOT_TOKEN=${
            finalToken.length === 0 ? "ENTER_YOUR_BOT_TOKEN" : finalToken
        }`,
    );

    envEntries.push(`PREFIX=${finalPrefix.length === 0 ? "!" : finalPrefix}`);

    await fs.outputFile(paths.dotEnv, envEntries.join("\n") + "\n");

    /* tsconfig */
    if (mode === InitMode.TS) {
        const templateTSConfig = path.join(
            TEMPLATE_DIR,
            "typescript",
            "tsconfig.json",
        );

        await fs.copy(templateTSConfig, paths.tsconfig);
    }

    /* Copy neccessary files */
    await fs.copy(path.join(TEMPLATE_DIR, mode), cwd);

    if (mode === InitMode.TS) {
        console.log("Building... (happens only in TS)");

        /* if it is in typescript then automatically build it! */
        try {
            await shell("tsc");
        } catch (reason) {
            console.log(
                `[${chalk.yellow("Warning")}]: No typescript package installed`,
            );
        }
    }

    /* Commiting a project when git cli is available */
    if (git) {
        console.log("Setting up Git..");
        await shell("git add .");
        await shell(`git commit -a -m "Initial commit"`);
    }

    console.log("Done!");
}

const TS_DESCRIPTION = "Generate Discord bot with TypeScript";
const JS_DESCRIPTION = "Generate Discord bot with JavaScript";

export = identity<yargs.CommandModule<{}, InitOptions>>({
    command: "init",
    describe: "Create a project from a template",
    builder: () =>
        yargs
            .option("git", {
                boolean: true,
                describe: "Configure Git (requires Git cli to do this)",
            })
            .option("eslint", {
                boolean: true,
                describe: "Configure ESLint",
            })
            .option("prettier", {
                boolean: true,
                describe: "Configure Prettier",
            })
            .command(InitMode.JS, JS_DESCRIPTION, {}, argv =>
                init(argv, InitMode.JS),
            )
            .command(InitMode.TS, TS_DESCRIPTION, {}, argv =>
                init(argv, InitMode.TS),
            ),
    handler: argv => init(argv, InitMode.None),
});
