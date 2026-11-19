import {
    getExecutable,
    getProcessInfo,
    killProcess
} from "../process.js";
import { findProcess, isValidPort } from "../port.js";
import { ask } from "../prompt.js";
import { ansi } from "../formatting.js";

export async function runSingle(args, { skipConfirmation = false, force = false } = {}) {
    for (const port of args) {

        if (!isValidPort(port)) {
            console.error(ansi.red(`Invalid port: ${port}`));
            continue;
        }

        const pids = await findProcess(port);

        if (!pids || pids.length === 0) {
            console.log(ansi.cyan(`The port ${port} is not in use.`));
            continue;
        }

        for (const pid of pids) {
            try {
                const info = await getProcessInfo(pid);
                const executable = await getExecutable(pid);

                let confirmed = skipConfirmation && !force;

                info.process = executable || info.process;

                console.log(`Port ${ansi.bold(port)} is being used by PID ${ansi.bold(pid)}.`);
                console.log(`\n${ansi.dim("User")}     ${info.user}\n${ansi.dim("Command")}  ${info.args}\n${ansi.dim("Process")}  ${info.process}\n`);

                if (!confirmed) {
                    const answer = await ask(
                        force
                            ? ansi.red("Forcefully terminate this process? [y/n]: ")
                            : ansi.yellow("Kill this process? [y/n]: ")
                    );

                    confirmed = answer.trim().toLowerCase() === 'y';
                }

                if (confirmed) {
                    const killed = killProcess(pid, force);

                    if (killed) {
                        console.log(ansi.green(`Process ${ansi.bold(pid)} terminated successfully.`))
                        console.log(ansi.dim(`-----------------------------------------`));
                    } else {
                        console.log(ansi.red(`Failed to terminate the process ${pid}.`))
                    }

                } else {
                    console.log(ansi.red(`Process ${ansi.bold(pid)} was not terminated.`));
                    console.log(ansi.dim(`-----------------------------------------`));
                }
            } catch (error) {
                console.error(ansi.red(`Failed to inspect process ${pid}: ${error.message}.`));
            }
        }
    }
}