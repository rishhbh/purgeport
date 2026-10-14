import { findProcessUnix, findAllProcessesUnix } from "./platform/unix.js"
import { findAllProcessesWin32, findProcessWin32 } from "./platform/windows.js";

export function findProcess(port) {
    if (process.platform === 'linux' || process.platform === 'darwin') {
        return findProcessUnix(port);
    }

    if (process.platform === 'win32') {
        return findProcessWin32(port);
    }

    throw new Error(`Unsupported operating system: ${process.platform}`);
}

export function findAllProcesses() {
    if (process.platform === 'linux' || process.platform === 'darwin') {
        return findAllProcessesUnix();
    }

    if (process.platform === 'win32') {
        return findAllProcessesWin32();
    }

    throw new Error(`Unsupported operating system: ${process.platform}`);
}

export function isValidPort(port) {
    return /^\d+$/.test(port) && Number(port) >= 1 && Number(port) <= 65535;
}