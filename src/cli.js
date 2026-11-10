#!/usr/bin/env node

import packageJson from "../package.json" with { type: "json" };
import { runAll } from "./run/all.js";
import { runSingle } from "./run/single.js";

const args = process.argv.slice(2);

const options = [
    "-y", "--yes",
    "-h", "--help",
    "-v", "--version"
];

const skipConfirmation = args.includes("-y") || args.includes("--yes");

const unknownOptions = args.find(arg => arg.startsWith("-") && !options.includes(arg));

if (args.includes("--version") || args.includes("-v")) {
    console.log(packageJson.version);
    process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
    console.log(`purgeport - Kill processes using network ports

Usage:
  purgeport <port>...
  purgeport all

Options:
  -h, --help       Show help
  -v, --version    Show version
  -y, --yes        Skip confirmation prompts`);

    process.exit(0);
}

if (unknownOptions) {
    console.log(`Unknown option: ${unknownOptions}`);
    console.log(`Try 'purgeport --help' for available options.`);
    process.exit(1);
}

const positionalArgs = args.filter(arg => !options.includes(arg));

const command = positionalArgs[0];

if (!command) {
    console.log(`Usage:
- purgeport <port>
- purgeport all`);

    process.exit(1);
}

if (command === 'all') {
    await runAll({ skipConfirmation });
} else {
    await runSingle(positionalArgs, { skipConfirmation });
}
