# purgeport

<p align="center">
  <img src="https://raw.githubusercontent.com/rishhbh/purgeport/main/assets/purgeport.png" alt="purgeport" />
</p>

A CLI tool to find and kill processes occupying network ports.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Ever run into `Error: listen EADDRINUSE: address already in use :::3000`? **purgeport** finds whatever process is holding the port, shows you what it is, and kills it after you confirm.

---

## Features

- **Process Inspection:** Shows the user, full command, and executable path across Linux, macOS, and Windows before asking to terminate.
- **Cross-Platform Port Lookup:** Uses `lsof` on Unix/macOS and `netstat` / PowerShell on Windows to map ports to PIDs.
- **Interactive Confirmation:** Always asks `[y/n]` before terminating any process.
- **Multi-Port Support:** Check and kill processes on multiple ports in a single run (`purgeport 3000 8080 5000`).
- **Kill All Listening Processes:** Interactively inspect and terminate processes on all active listening ports (`purgeport all`).
- **CLI Flag Validation:** Rejects unrecognized flags with a clear error and exit code `1`.
- **Zero External Dependencies:** Built entirely with Node.js built-ins and native operating system commands.

---

## Prerequisites

- **Node.js** (v18.0.0 or higher)
- **Supported Platforms:**
  - **Linux:** requires `lsof` and `ps` (standard on most distros)
  - **macOS:** requires `lsof` and `ps` (preinstalled)
  - **Windows:** requires PowerShell 5.1+ (preinstalled on Windows 10/11)

---

## Installation

### Global Install

```bash
# npm
npm install -g purgeport

# pnpm
pnpm add -g purgeport

# yarn
yarn global add purgeport
```

### Run via npx

```bash
npx purgeport <port>
```

---

## Usage

### Kill a process on a single port

```bash
purgeport 3000
```

When a process is found, its details are printed before asking for confirmation:

```text
Port 3000 is being used by PID 41280.

User: rishabh
Command: node server.js
Process: /home/rishabh/.nvm/versions/node/v20.0.0/bin/node

Kill this process? [y/n]: y
Process 41280 terminated successfully.
-----------------------------------------
```

### Kill processes across multiple ports

```bash
purgeport 3000 8080 5000
```

### Kill all listening processes interactively

```bash
purgeport all
```

Scans every active listening port, displays its process info, and prompts for confirmation for each process.

### CLI Options

```bash
purgeport --help       # Show help message
purgeport --version    # Show installed version
```

Unrecognized flags exit with an error:

```text
$ purgeport --foo
Unknown option: --foo
Try 'purgeport --help' for available options.
```

---

## How It Works

1. **Port resolution:**
   - **Linux / macOS:** Runs `lsof -i :<port> -t` for specific ports, or `lsof -nP -iTCP -sTCP:LISTEN -Fpn` for `purgeport all`.
   - **Windows:** Runs `netstat -ano | findstr :<port>` for specific ports, or PowerShell `Get-NetTCPConnection -State Listen` for `purgeport all`.
2. **Process inspection:**
   - **Linux:** Reads `/proc/<pid>/exe` for the binary path and runs `ps -p <pid> -o user=,comm=,args=` for owner and command args.
   - **macOS:** Runs `lsof -p <pid> -d txt -Fn` for the binary path and `ps -p <pid> -o user=,comm=,args=` for owner and command args.
   - **Windows:** Uses PowerShell CIM (`Get-CimInstance Win32_Process`) to extract `ExecutablePath`, `CommandLine`, and process owner (`GetOwner`).
3. **Termination:**
   - Sends `process.kill(pid, "SIGTERM")` once confirmed with `y`.

---

## Permissions

If a process was started by root/another user, or is bound to a privileged port (e.g., `80` or `443`), run with elevated permissions:

```bash
# Linux / macOS
sudo purgeport 80
```

On Windows, run your terminal or PowerShell as **Administrator**.

---

## Development

Clone the repo and link it locally to test changes:

```bash
git clone https://github.com/rishhbh/purgeport.git
cd purgeport
npm link
```

Now you can test `purgeport <port>` or `purgeport all` directly.

---

## License

MIT - see [LICENSE](LICENSE) for details.

## Author

Created by [Rishabh Sharma](https://github.com/rishhbh).
