import { exec } from "node:child_process";

export function findProcessWin32(port) {
    return new Promise((resolve) => {
        exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
            if (error || !stdout.trim()) {
                resolve([]);
                return;
            }

            const pids = [...new Set(
                stdout
                    .trim()
                    .split(/\r?\n/)
                    .map(line => line.trim().split(/\s+/).pop())
                    .filter(pid => pid && /^\d+$/.test(pid) && pid !== "0")
            )];

            resolve(pids);
        });
    });
}

export function getProcessInfoWin32(pid) {
    return new Promise((resolve, reject) => {
        const command = `powershell -NoProfile -Command "$p = Get-CimInstance Win32_Process -Filter 'ProcessId = ${Number(pid)}'; $owner = Invoke-CimMethod -InputObject $p -MethodName GetOwner; [PSCustomObject]@{ user = $owner.User; process = $p.ExecutablePath; args = $p.CommandLine } | ConvertTo-Json -Compress"`;
        exec(command, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }

            try {
                resolve(JSON.parse(stdout.trim()));
            } catch (err) {
                reject(err);
            }
        });
    });
}

export function findAllProcessesWin32() {
    return new Promise((resolve, reject) => {
        const command = `powershell -NoProfile -Command "Get-NetTCPConnection -State Listen | Select-Object @{Name='pid'; Expression={$_.OwningProcess}}, @{Name='port'; Expression={$_.LocalPort}} | ConvertTo-Json -Compress"`;
        exec(command, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }

            try {
                const parsed = JSON.parse(stdout.trim() || "[]");
                const processes = Array.isArray(parsed) ? parsed : [parsed];
                
                resolve(processes);
            } catch (err) {
                reject(new Error(`Failed to find listening processes: ${err.message}.`));
            }
        });
    });
}