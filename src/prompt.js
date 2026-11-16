import readline from "node:readline";
import { ansi } from "./formatting.js";

export function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", () => {
        console.log(`\n${ansi.cyan("Operation cancelled by user.")}`);
        process.exit(130);
    })

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
