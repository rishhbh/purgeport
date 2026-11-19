import {
    getExecutableDarwin,
    getExecutableLinux,
    getProcessInfoUnix,
} from "../platform/unix.js";
import { getProcessInfoWin32 } from "../platform/windows.js";
import { findAllProcesses } from "../port.js";
import { killProcess } from "../process.js";
import { ask } from "../prompt.js";
import { ansi } from "../formatting.js";

export async function runAll({ skipConfirmation = false, force = false } = {}) {
    const processes = await findAllProcesses();
    const killedPids = new Set();

    for (const proc of processes) {
        let confirmed = skipConfirmation && !force;

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

            console.log(`Port ${ansi.bold(details.port)} is being used by PID ${ansi.bold(proc.pid)}.`);
            console.log(`\n${ansi.dim("User")}     ${details.user}\n${ansi.dim("Command")}  ${details.args}\n${ansi.dim("Process")}  ${details.process}\n`);

            if (!confirmed) {
                const answer = await ask(
                    force
                        ? ansi.red("Forcefully terminate this process? [y/n]: ")
                        : ansi.yellow("Kill this process? [y/n]: ")
                );

                confirmed = answer.trim().toLowerCase() === 'y';
            }

            if (confirmed) {
                const killed = killProcess(proc.pid, force);

                if (killed) {
                    console.log(ansi.green(`Process ${ansi.bold(details.pid)} terminated successfully.`));
                    console.log(ansi.dim("-----------------------------------------"));
                    killedPids.add(proc.pid);
                } else {
                    console.log(ansi.red(`Failed to terminate the process ${details.pid}.`))
                }

            } else {
                console.log(ansi.red(`Process ${ansi.bold(details.pid)} was not terminated.`));
                console.log(ansi.dim(`-----------------------------------------`));
            }
        } catch (error) {
            console.error(ansi.red(`Failed to inspect process ${proc.pid}: ${error.message}.`));
            continue;
        }
    }
}
