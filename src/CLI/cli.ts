#!/usr/bin/env node

import yargs from "yargs";
import { PACKAGE_ROOT, PKG_VERSION } from "../Shared/constants";

yargs
    /* Help */
    .usage("Discord bot creator")
    .help("help")
    .alias("h", "help")
    .describe("help", "Shows help information")

    /* Version */
    .version(PKG_VERSION)
    .alias("v", "version")
    .describe("version", "Shows version information")

    /* Load commands */
    .commandDir(`${PACKAGE_ROOT}/out/CLI/commands`)

    /* Options */
    .recommendCommands()
    .strict()
    .wrap(yargs.terminalWidth())

    /* Execute */
    .parse();
