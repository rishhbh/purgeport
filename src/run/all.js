import {
    getExecutableDarwin,
    getExecutableLinux,
    getProcessInfoUnix,
} from "../platform/unix.js";
import { getProcessInfoWin32 } from "../platform/windows.js";
import { findAllProcesses } from "../port.js";
import { killProcess } from "../process.js";
import { ask } from "../prompt.js";

export async function runAll({ skipConfirmation = false } = {}) {
    const processes = await findAllProcesses();
    const killedPids = new Set();

    for (const proc of processes) {
        let confirmed = skipConfirmation;

        if (killedPids.has(proc.pid)) {
            continue;
        }

        try {
            const command = process.platform === 'win32' ? await getProcessInfoWin32(Number(proc.pid)) : await getProcessInfoUnix(Number(proc.pid));

            const details = { ...proc, ...command };

            if (process.platform === 'linux') {
                details.process = await getExecutableLinux(Number(proc.pid));
            } else if (process.platform === 'darwin') {
                details.process = await getExecutableDarwin(Number(proc.pid));
            }

            console.log(`Port ${details.port} is being used by PID ${details.pid}.`);
            console.log(`\nUser: ${details.user}\nCommand: ${details.args}\nProcess: ${details.process}\n`);

            if (!skipConfirmation) {
                const answer = await ask("Kill this process? [y/n]: ");
                confirmed = answer.trim().toLowerCase() === 'y';
            }

            if (confirmed) {
                const killed = killProcess(proc.pid);

                if (killed) {
                    console.log(`Process ${details.pid} terminated successfully.`)
                    console.log(`-----------------------------------------`);
                    killedPids.add(proc.pid);
                } else {
                    console.log(`Failed to terminate the process ${details.pid}.`)
                }

            } else {
                console.log(`Process ${details.pid} was not terminated.`);
                console.log(`------------------------------------`);
            }
        } catch (error) {
            console.error(`Failed to inspect process ${proc.pid}: ${error.message}`);
            continue;
        }
    }
}
