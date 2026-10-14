import {
    getExecutable,
    getProcessInfo,
    killProcess
} from "../process.js";
import { findProcess, isValidPort } from "../port.js";
import { ask } from "../prompt.js";

export async function runSingle(args) {
    for (const port of args) {
        if(!isValidPort(port)){
            console.error(`Invalid port: ${port}.`);
            continue;
        }
        
        const pid = await findProcess(port);

        if (!pid) {
            console.log(`The port ${port} is not in use.`);
            continue;
        }

        const info = await getProcessInfo(pid);
        const executable = await getExecutable(pid);

        info.process = executable || info.process;

        console.log(`Port ${port} is being used by PID ${pid}.`);
        console.log(`\nUser: ${info.user}\nCommand: ${info.args}\nProcess: ${info.process}\n`);

        const answer = await ask("Kill this process? [y/n]: ");

        if (answer.trim().toLowerCase() === 'y') {
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
    }
}