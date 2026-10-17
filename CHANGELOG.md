# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-15

### Added
- **Interactive All-Port Cleanup (`purgeport all`):** Introduced `purgeport all` command to discover and interactively inspect all active listening TCP processes across the system, prompting for confirmation before terminating each process.
- **Cross-Platform Listening Process Discovery:**
  - Unix/macOS: Discovers active listening TCP processes and ports using `lsof -nP -iTCP -sTCP:LISTEN -Fpn`.
  - Windows: Discovers listening ports and owning PIDs via PowerShell cmdlet (`Get-NetTCPConnection -State Listen`).
- **Port Input Validation:** Added `isValidPort` validation utility ensuring specified port arguments are valid numbers between 1 and 65535, logging informative error messages for invalid ports before query execution.
- **Branding & Package Assets:** Added project banner image (`assets/purgeport.png`) to README documentation and added `assets/` to `.npmignore` to keep npm distributions lightweight.

### Changed
- **Modular CLI Runner Architecture:** Separated command dispatching into dedicated runner modules:
  - `src/run/single.js`: Single and multi-port inspection and termination.
  - `src/run/all.js`: Comprehensive listening port discovery and batch interactive cleanup.
- **Enhanced Termination Output:** Standardized process termination feedback with explicit success messaging and output separation lines.
- **Package Discoverability:** Expanded npm keywords in `package.json` covering port management, signals, process management, and networking tools.

### Fixed
- **Multi-Port Process Binding:** Correctly associates processes bound to multiple network ports in Unix/macOS listening discovery without dropping bindings.
- **Windows Discovery Normalization:** Safely normalizes single or multi-object JSON output from PowerShell `Get-NetTCPConnection`.
- **Resilient Batch Iteration:** Added error boundaries around process inspection in `runAll` so transient processes or permission issues on individual ports do not abort the full scan.

## [0.2.0] - 2026-10-10

### Added
- **Cross-Platform Process Discovery:** Port detection support for Windows using `netstat` alongside Unix/macOS `lsof`.
- **Process Inspection:** Displays detailed process information (owner `User`, command-line arguments `Command`, and binary path `Process`) before prompting for confirmation.
- **Cross-Platform Metadata Resolution:**
  - Windows process details (executable path, arguments, owner) resolved via PowerShell CIM cmdlets (`Get-CimInstance Win32_Process`).
  - macOS executable path resolution using `lsof -p <pid> -d txt -Fn`.
  - Linux executable path resolution using `/proc/<pid>/exe`.
- **CLI Flag Validation:** Unrecognized command-line flags are caught and rejected with an informative error message and exit code `1`.
- **Cross-Platform CI Workflow:** Automated GitHub Actions E2E integration test suite covering Linux, macOS, and Windows.

### Changed
- **Project Renaming:** Renamed the project from `portkill` to `purgeport`.
- **Modular Platform Architecture:** Refactored platform-specific resolution logic into dedicated modules (`src/platform/unix.js` and `src/platform/windows.js`) routed dynamically by `src/port.js` and `src/process.js`.

## [0.1.0] - 2026-10-06

### Added
- **Port Inspection:** Automatic detection of process IDs (PIDs) bound to specified network ports using `lsof`.
- **Interactive Confirmation:** Prompt asking for confirmation (`[y/n]`) prior to killing any process to prevent accidental terminations.
- **Multi-Port Support:** Ability to pass multiple ports in a single command (e.g., `purgeport 3000 8080`).
- **Process Termination:** Terminate identified processes using `SIGTERM`.
- **CLI Options:** Built-in `-h`, `--help` and `-v`, `--version` flags.
- **Executable Binary:** Executable `purgeport` binary setup via `package.json` pointing to `src/cli.js`.

[1.0.0]: https://github.com/rishhbh/purgeport/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/rishhbh/purgeport/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/rishhbh/purgeport/releases/tag/v0.1.0
