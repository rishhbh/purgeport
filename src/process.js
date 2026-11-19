import { getExecutableDarwin, getProcessInfoUnix } from "./platform/unix.js";
import { getProcessInfoWin32 } from "./platform/windows.js";
import { getExecutableLinux } from "./platform/unix.js";

export function killProcess(pid, force = false) {
    try {
        process.kill(
            Number(pid),
            force ? "SIGKILL" : "SIGTERM"
        );

        return true;
    } catch (err) {
        console.error(err)
        return false;
    }
}

export function getProcessInfo(pid) {
    if (process.platform === 'linux' || process.platform === 'darwin') {
        return getProcessInfoUnix(pid);
    }

    if (process.platform === 'win32') {
        return getProcessInfoWin32(pid);
    }

    throw new Error(`Unsupported operating system: ${process.platform}`);
}

export function getExecutable(pid) {
    if (process.platform === 'win32') {
        return Promise.resolve(null);
    }

    if (process.platform === 'linux') {
        return getExecutableLinux(pid);
    }

    if (process.platform === 'darwin') {
        return getExecutableDarwin(pid);
    }

    throw new Error(`Unsupported operating system: ${process.platform}`);
}