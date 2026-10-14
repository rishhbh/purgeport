#!/usr/bin/env node

import packageJson from "../package.json" with { type: "json" };
import { runAll } from "./run/all.js";
import { runSingle } from "./run/single.js";

const args = process.argv.slice(2);

const command = args[0];

if (args.some(arg => arg.startsWith("-"))) {
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
  -v, --version    Show version`);

        process.exit(0);
    }

    console.log(`Unknown option: ${args.find(arg => arg.startsWith("-"))}`);
    console.log(`Try 'purgeport --help' for available options.`);
    process.exit(1);
}

if (!command) {
    console.log(`Usage:
- purgeport <port>
- purgeport all`);

    process.exit(1);
}

if (command === 'all') {
    runAll();
} else {
    runSingle(args);
}