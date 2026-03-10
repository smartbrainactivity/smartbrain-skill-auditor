# AI Skill Auditor v2.0

![SMARTbrain Auditor](assets/banner.png)

[![Creator](https://img.shields.io/badge/Creator-SMARTbrain%20Activity-blue)](https://www.smartbrainactivity.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A universal, dependency-free Node.js tool to statically audit AI Skills and local agents (like those used in Claude, Cursor, Antigravity) for malicious patterns and hidden **Ghost Prompts**.

[🇪🇸 Leer en Español](README.es.md)

Before running downloaded skills full of `.js`, `.py`, `.sh`, or `.md` files, scan them to ensure they don't contain harmful code or malicious embedded instructions.

### What does it detect? (6 risk categories)

| # | Category | Examples |
|---|----------|----------|
| 1 | **Dynamic code execution** | `eval()`, `new Function()`, `setTimeout` with strings, `vm.runInNewContext`, `exec()`, `compile()`, `__import__`, `pickle.loads` |
| 2 | **Exfiltration & covert communications** | `fetch()`, `axios`, `WebSocket`, `XMLHttpRequest`, `require('http')`, `curl\|bash`, `wget\|bash` |
| 3 | **Destructive commands** | `rm -rf`, `del /f`, `mkfs`, `dd if=`, `chmod 777`, reverse shells with `nc -e` |
| 4 | **Payload obfuscation** | `atob()`, `Buffer.from(…, 'base64')`, `base64 -d \| bash`, long hex strings |
| 5 | **Hardcoded credentials** | API keys (`sk-`, `ghp_`, `AKIA`), tokens, passwords in strings |
| 6 | **👻 Ghost Prompts in Markdown** | `ignore previous instructions`, `do not tell the user`, `override safety`, `exfiltrate data`, `run_command SafeToAutoRun`, zero-width characters, HTML comment injections |

Additionally, at the end of each scan the auditor prints a **complete inventory of all prompts and directives** found in `.md` files, so you can review what instructions each skill actually contains.

## Method 1: Use the official Plug & Play repository
1. Clone or download this repository into your global skills folder (e.g., `antigravity/skills/`).
2. Run the auditor against ANY folder on your computer:
```bash
node ai-skill-auditor/bin/audit.js "C:/path/to/suspicious/skill"
```
3. If the skill passes the audit, you'll receive a terminal output confirming 0 vulnerabilities and a green Markdown badge like this:
[![SMARTbrain Audit](https://img.shields.io/badge/SMARTbrain_Audit-Passed-brightgreen)](https://github.com/SMARTbrainActivity/ai-skill-auditor)

**Configure your own rules:** You can open `config/rules.json` to add new malicious RegEx patterns for JavaScript, Python, Shell, or Markdown without touching the main code.

---

## Method 2: The "Build It Yourself" One-Shot Prompt
Don't trust downloading external repositories? We understand. As cybersecurity advocates, we encourage you to build your own auditor using your AI.

Just paste this **Master Prompt** into your AI coding assistant (Claude, Cursor, etc.):

> *"Act as an AI Cybersecurity Expert specialized in prompt injection and supply-chain attacks on AI Skills. Create a folder named `smartbrain-skill-auditor` with a Node.js script (zero external dependencies) designed to statically audit local directories. The scanner must cover the following risk categories:*
>
> *1. **Dynamic code execution**: `eval()`, `new Function()`, `setTimeout/setInterval` with strings, `vm.runInNewContext`, dynamic `import()` in JS; `eval()`, `exec()`, `compile()`, `__import__`, `importlib`, `pickle.loads` in Python.*
> *2. **Exfiltration and covert communications**: `fetch()`, `axios`, `XMLHttpRequest`, `WebSocket`, `require('http/https')`, `curl|bash`, `wget|bash`, hardcoded URLs with tokens.*
> *3. **Destructive commands**: `rm -rf`, `del /f`, `mkfs`, `format`, `dd if=`, `chmod 777`, reverse shells with `nc -e`.*
> *4. **Payload obfuscation**: `atob()`, `Buffer.from(…, 'base64')`, `base64 -d | bash`, suspiciously long hex strings.*
> *5. **Hardcoded credentials and secrets**: API keys (patterns like `sk-`, `ghp_`, `AKIA`), tokens, passwords in strings.*
> *6. **Ghost Prompts in Markdown files (.md)**: hidden instructions like `ignore previous instructions`, `you are now`, `do not tell the user`, `send data to`, `override safety`, `bypass security`, `execute command`, `run_command`, and zero-width characters or HTML comments with injections.*
>
> *The script must:*
> - *Separate the logic (`bin/audit.js`) from the rules (`config/rules.json`) with regular expressions by category (javascript, python, shell, markdown) so anyone can update the rules without touching the code.*
> - *Recursively scan all `.js`, `.ts`, `.py`, `.sh`, `.bat`, `.ps1`, and `.md` extensions.*
> - *At the end of the scan, print an inventory of all prompts and directives found in `.md` files (searching for patterns like "Act as", "You are", "Your role is", YAML frontmatter with `---`, and sections titled "Instructions" or "System Prompt") so the user can review what instructions each skill contains.*
> - *If the audit passes (0 vulnerabilities), print a green Markdown security badge to the terminal.*
> - *If the audit fails, list each file and detected pattern with severity level.*
>
> *Generate the complete folder structure and files in a single step."*

---
*Created by [SMARTbrain Activity](https://www.smartbrainactivity.ai) - Elevating AI safety for domestic and professional users.*
