import { exec } from "node:child_process";

export function findProcessUnix(port) {
    return new Promise((resolve, reject) => {
        exec(`lsof -i :${port} -t`, (error, stdout) => {
            if (error) {
                resolve(null);
                return;
            }

            const pid = stdout.trim();

            resolve(pid || null);
        });
    });
}

export function getProcessInfoUnix(pid) {
    return new Promise((resolve, reject) => {
        exec(`ps -p ${pid} -o user=,comm=,args=`,
            (error, stdout) => {
                if (error) {
                    reject(error);
                    return;
                }

                const [user, command, ...args] = stdout.trim().split(/\s+/);

                resolve({
                    pid,
                    user,
                    command,
                    args: args.join(" ")
                });
            }
        )
    });
}

export function getExecutableLinux(pid) {
    return new Promise((resolve, reject) => {
        exec(`readlink -f /proc/${pid}/exe`, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(stdout.trim());
        });
    });
}

export function getExecutableDarwin(pid) {
    return new Promise((resolve, reject) => {
        if (!Number.isInteger(Number(pid)) || Number(pid) <= 0) {
            reject(new Error("Invalid PID"));
            return;
        }

        exec(`lsof -p ${pid} -d txt -Fn`, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }

            const executable = stdout.split("\n").find(line => line.startsWith("n/"))?.slice(1);

            if (!executable) {
                reject(new Error(`Could not find executable for PID ${pid}`));
                return;
            }

            resolve(executable);
        });
    });
}

export function findAllProcessesUnix() {
    return new Promise((resolve, reject) => {
        exec(`lsof -nP -iTCP -sTCP:LISTEN -Fpn`, (error, stdout) => {
            if (error) {
                if (!stdout.trim()) {
                    resolve([]);
                    return;
                }
            }

            const processes = [];
            let pid = null;

            for (const line of stdout.trim().split(/\r?\n/)) {
                const key = line[0];
                const value = line.slice(1);

                if (key === 'p') {
                    pid = value;
                }

                if (key === 'n' && pid) {
                    const match = value.match(/:(\d+)$/);

                    if (match) {
                        processes.push({
                            pid,
                            port: match[1]
                        });
                    }
                }
            }
            
            resolve(processes);
        });
    });
}