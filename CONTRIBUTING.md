# Contributing to purgeport

Thank you for your interest in contributing to **purgeport**! We welcome community contributions, bug reports, feature suggestions, and documentation improvements.

Please take a few moments to review these guidelines before getting started.

---

## Core Project Principles

Before proposing or implementing changes, please keep our core tenets in mind:

1. **Zero External Dependencies:**
   `purgeport` is committed to having **zero** third-party npm dependencies. All functionality relies solely on Node.js built-in modules (`node:child_process`, `node:readline`, `node:fs`, etc.) and native operating system utilities. Do not add packages to `dependencies`.
2. **Cross-Platform Parity:**
   Every feature and bug fix must maintain compatibility across **Linux**, **macOS**, and **Windows**. When modifying platform-specific code in `src/platform/`, ensure behavior is equivalent across all supported systems.
3. **Pure ES Modules:**
   The project uses native Node.js ES Modules (`"type": "module"`). Always use explicit file extensions in import statements (e.g., `import { ansi } from "./formatting.js";`).
4. **Safety First:**
   Process termination must always prioritize safety:
   - Interactive confirmation is required by default.
   - Forceful termination (`SIGKILL`) always prompts for user confirmation.
   - Destructive operations (such as `purgeport all`) must include clear warnings.

---

## Codebase Map

Here is how the project is organized:

```
purgeport/
├── .github/
│   ├── workflows/ci.yml       # Cross-platform GitHub Actions CI matrix
│   └── pull_request_template.md
├── assets/                    # Project logos and media
├── src/
│   ├── cli.js                 # CLI entry point, flag parsing, and help
│   ├── formatting.js          # ANSI terminal styling with NO_COLOR/FORCE_COLOR support
│   ├── port.js                # Port validation and cross-platform port lookup
│   ├── process.js             # Process metadata inspection and termination
│   ├── prompt.js              # Interactive terminal input prompts (readline)
│   ├── platform/
│   │   ├── unix.js            # Linux and macOS implementations (lsof, ps, /proc)
│   │   └── windows.js         # Windows implementations (netstat, PowerShell CIM)
│   └── run/
│       ├── single.js          # Execution workflow for specific port(s)
│       └── all.js             # Execution workflow for all listening ports
├── CHANGELOG.md               # Version release notes
├── CONTRIBUTING.md            # Contributor guidelines (this file)
├── LICENSE                    # MIT license
├── package.json               # Package configuration and scripts
├── README.md                  # Project documentation and usage guide
└── SECURITY.md                # Security vulnerability reporting policy
```

---

## Getting Started

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **Git**
- Platform-specific system tools:
  - **Linux / macOS:** `lsof` and `ps`
  - **Windows:** PowerShell 5.1+

### Local Setup

1. Fork the repository on GitHub: [https://github.com/rishhbh/purgeport](https://github.com/rishhbh/purgeport)
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/purgeport.git
   cd purgeport
   ```
3. Test running the CLI locally directly with Node:
   ```bash
   node src/cli.js --help
   node src/cli.js --version
   ```
4. (Optional) Link the package globally to test the `purgeport` command directly:
   ```bash
   npm link
   purgeport --version
   ```
   To unlink after development:
   ```bash
   npm unlink -g purgeport
   ```

---

## Testing Changes Locally

Test changes locally by executing the CLI directly with Node against test ports:

```bash
node src/cli.js --help
node src/cli.js --version
node src/cli.js <port>
```

When adding features or fixing bugs, verify that the behavior works as expected on your operating system and maintains cross-platform compatibility.

---

## Coding Standards

- **Formatting:** 4 spaces for indentation in JavaScript files, LF line endings, and semicolons.
- **Imports:** Always specify relative file paths with `.js` extensions:
  ```javascript
  import { isValidPort } from "./port.js";
  ```
- **Error Handling:** Avoid printing raw stack traces for expected user input errors (e.g., invalid ports or unrecognized flags). Provide clear, actionable error messages using `ansi.red()`.
- **Terminal Output:** Use the helper functions from `src/formatting.js` for colors and text styling. Never hardcode ANSI sequences directly in command handlers.
- **No Third-Party Packages:** Check `package.json` before committing to make sure no external dependencies were added.

---

## Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification to keep a clean, readable history:

- `feat:` A new user-facing feature or CLI option (e.g., `feat: add -f, --force flag for forceful process termination`)
- `fix:` A bug fix (e.g., `fix: support multiple processes per port across Unix and Windows`)
- `docs:` Documentation changes only (e.g., `docs: update installation instructions in README`)
- `test:` Adding or refactoring tests (e.g., `test: add unit tests for port validation`)
- `refactor:` Code refactoring that neither fixes a bug nor adds a feature
- `style:` Code style, formatting, or indentation changes with no logic impact
- `chore:` Maintenance tasks, repository configuration, or release version bumps

---

## Pull Request Guidelines

1. **Create a topic branch:**
   ```bash
   git checkout -b feat/my-new-feature
   ```
2. **Keep changes focused:** A PR should address a single bug or feature. Smaller, self-contained pull requests are reviewed and merged much faster.
3. **Verify changes locally:** Ensure the CLI behaves as expected and does not break existing functionality.
4. **Test on your OS:** Verify that the CLI behaves as expected when run with test ports.
5. **Open a Pull Request:**
   - Target the `main` branch.
   - Fill out the provided [Pull Request Template](.github/pull_request_template.md).
   - Reference any related issue (e.g., `Fixes #12`).
6. **CI Checks:** Automated cross-platform GitHub Actions workflows will run your branch against Linux, macOS, and Windows. Ensure all matrix checks pass.
