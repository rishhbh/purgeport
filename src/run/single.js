import {
    getExecutable,
    getProcessInfo,
    killProcess
} from "../process.js";
import { findProcess, isValidPort } from "../port.js";
import { ask } from "../prompt.js";

export async function runSingle(args, { skipConfirmation = false } = {}) {
    for (const port of args) {

        if (!isValidPort(port)) {
            console.error(`Invalid port: ${port}.`);
            continue;
        }

        const pids = await findProcess(port);

        if (!pids || pids.length === 0) {
            console.log(`The port ${port} is not in use.`);
            continue;
        }

        for (const pid of pids) {
            try {
                const info = await getProcessInfo(pid);
                const executable = await getExecutable(pid);

                let confirmed = skipConfirmation;

                info.process = executable || info.process;

                console.log(`Port ${port} is being used by PID ${pid}.`);
                console.log(`\nUser: ${info.user}\nCommand: ${info.args}\nProcess: ${info.process}\n`);

                if (!skipConfirmation) {
                    const answer = await ask("Kill this process? [y/n]: ");
                    confirmed = answer.trim().toLowerCase() === 'y';
                }

                if (confirmed) {
                    const killed = killProcess(pid);

                    if (killed) {
                        console.log(`Process ${pid} terminated successfully.`)
                        console.log(`-----------------------------------------`);
                    } else {
                        console.log(`Failed to terminate the process ${pid}.`)
                    }

                } else {
                    console.log(`Process ${pid} was not terminated.`);
                    console.log(`------------------------------------`);
                }
            } catch (error) {
                console.error(`Failed to inspect process ${pid}: ${error.message}`);
            }
        }
    }
}