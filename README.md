# AI Skill Auditor

![SMARTbrain Auditor](assets/banner.png)

[![Creator](https://img.shields.io/badge/Creator-SMARTbrain%20Activity-blue)](https://www.smartbrainactivity.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A universal, dependency-free Node.js tool to statically audit AI Skills and local agents (like those used in Claude, Cursor, Antigravity) for malicious patterns. 

[🇪🇸 Leer en Español](README.es.md)

Before running downloaded skills full of `.js`, `.py`, or `.sh` files, scan them to ensure they don't contain harmful code (like hidden `eval()`, malicious HTTP requests, or destructive `rm -rf` commands).

## Method 1: Use the Official Plug & Play Repository
1. Clone or download this repository into your global skills folder (e.g., `antigravity/skills/`).
2. Run the auditor against ANY folder on your computer:
```bash
node ai-skill-auditor/bin/audit.js "C:/path/to/suspicious/skill"
```
3. If the skill passes the audit, you'll receive a terminal output confirming 0 vulnerabilities and a green Markdown badge like this:
[![SMARTbrain Audit](https://img.shields.io/badge/SMARTbrain_Audit-Passed-brightgreen)](https://github.com/SMARTbrainActivity/ai-skill-auditor)

**Configure your own rules:** You can open `config/rules.json` to add new malicious RegEx patterns for JavaScript, Python, or Shell without touching the main code.

---

## Method 2: The "Build It Yourself" One-Shot Prompt
Don't trust downloading external repositories? We understand. As cybersecurity advocates, we encourage you to build your own auditor using your AI.

Just paste this **Master Prompt** into your AI coding assistant (Claude, Cursor, etc.):
> *"Act as an AI Cybersecurity Expert. Create a folder named `smartbrain-skill-auditor` with a Node.js script (zero external dependencies) designed to scan local directories for common malicious patterns in AI scripts and Skills (like `eval` usage, unauthorized HTTP calls, or destructive commands like `rm -rf`). Separate the logic of the script (`audit.js`) from a centralized JSON file (`rules.json`) where you specify the malicious regular expressions so I can update them. Upon finishing scanning a clean folder, the script must print a green 'Security Validated' Markdown badge to the terminal. Generate all files in a single step."*

---
*Created by [SMARTbrain Activity](https://www.smartbrainactivity.ai) - Elevating AI safety for domestic and professional users.*
