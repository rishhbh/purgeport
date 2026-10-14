import {
    findAllProcessesUnix,
    getExecutableDarwin,
    getExecutableLinux,
    getProcessInfoUnix,
} from "../platform/unix.js";
import { killProcess } from "../process.js";
import { ask } from "../prompt.js";

export async function runAll() {
    const processes = await findAllProcessesUnix();

    for (let proc of processes) {
        const command = await getProcessInfoUnix(Number(proc.pid));

        proc = { ...proc, ...command };

        if (process.platform === 'linux') {
            const executable = await getExecutableLinux(Number(proc.pid));
            proc.executable = executable;
        }

        if (process.platform === 'darwin') {
            const executable = await getExecutableDarwin(Number(proc.pid));
            proc.executable = executable;
        }

        console.log(`Port ${proc.port} is being used by PID ${proc.pid}.`);
        console.log(`\nUser: ${proc.user}\nCommand: ${proc.args}\nProcess: ${proc.executable}\n`);

        const answer = await ask("Kill this process? [y/n]: ");

        if (answer.trim().toLowerCase() === 'y') {
            const killed = killProcess(proc.pid);

            if (killed) {
                console.log(`Process ${proc.pid} terminated successfully.`)
                console.log(`-----------------------------------------`);
            } else {
                console.log(`Failed to terminate the process ${proc.pid}.`)
            }

        } else {
            console.log(`Process ${proc.pid} was not terminated.`);
            console.log(`------------------------------------`);
        }
    }
}