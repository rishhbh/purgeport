# Security Policy

## Supported Versions

Security updates are provided for the latest minor and patch releases on the active major version:

| Version | Supported          |
| :------ | :----------------- |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Scope and Considerations

`purgeport` is a system utility that inspects active network listeners and terminates operating system processes. Because it invokes operating system commands (`lsof`, `ps`, `netstat`, PowerShell) and sends process signals (`SIGTERM`, `SIGKILL`), users may execute it with administrative permissions (`sudo` on Linux/macOS or elevated PowerShell on Windows).

Key design commitments regarding security:
- **Input validation:** Port numbers are strictly validated (ensuring values are valid integers between 1 and 65535) before being passed to system queries.
- **Zero dependencies:** No external third-party dependencies are loaded at runtime, eliminating dependency-tree supply-chain attack vectors.
- **Safe defaults:** Interactive confirmation is required by default before terminating any process. Forceful termination (`SIGKILL`) always requires user confirmation.

## Reporting a Vulnerability

If you discover a security vulnerability in `purgeport`, please do **not** disclose it in a public issue or pull request.

Instead, please report it via one of the following methods:
1. **GitHub Security Advisories:** Submit a private vulnerability report via [GitHub Private Vulnerability Reporting](https://github.com/rishhbh/purgeport/security/advisories/new) if enabled on the repository.
2. **Direct Contact:** Contact the repository maintainer through [GitHub (@rishhbh)](https://github.com/rishhbh).

Please include the following information in your report:
- A description of the issue and potential security impact.
- Clear steps to reproduce the issue (including sample commands or platform configurations).
- The operating system and Node.js version used.
- Any potential remediations or patches you have identified.

You will receive an acknowledgment of your report within 48 hours, followed by updates on progress toward a resolution.
