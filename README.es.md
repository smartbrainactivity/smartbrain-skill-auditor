# 🛡️ AI Skill Auditor v2.0 — para Antigravity · Claude Code · Gemini CLI · Cursor

![SMARTbrain Auditor](assets/banner.png)

[![Creador](https://img.shields.io/badge/Creador-SMARTbrain%20Activity-blue)](https://www.smartbrainactivity.ai)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](LICENSE)
![Antigravity Skill](https://img.shields.io/badge/Antigravity-Skill-black?logo=google&logoColor=white)
![Claude Code](https://img.shields.io/badge/Claude_Code-Compatible-blue?logo=anthropic&logoColor=white)
![Gemini CLI](https://img.shields.io/badge/Gemini_CLI-Compatible-4285F4?logo=google&logoColor=white)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-green)
![License MIT](https://img.shields.io/badge/License-MIT-yellow)

Una herramienta universal en Node.js, sin dependencias externas, para auditar de forma estática Skills de IA y agentes locales (como los usados en Claude, Cursor, Antigravity) en busca de patrones maliciosos y **Ghost Prompts** ocultos.

[🇬🇧 Read in English](README.md)

Antes de ejecutar directorios descargados llenos de archivos `.js`, `.py`, `.sh` o `.md`, escanéalos matemáticamente para asegurar que no contienen código peligroso ni instrucciones embebidas maliciosas.

### ¿Qué detecta? (6 categorías de riesgo)

| # | Categoría | Ejemplos |
|---|-----------|----------|
| 1 | **Ejecución dinámica de código** | `eval()`, `new Function()`, `setTimeout` con strings, `vm.runInNewContext`, `exec()`, `compile()`, `__import__`, `pickle.loads` |
| 2 | **Exfiltración y comunicaciones ocultas** | `fetch()`, `axios`, `WebSocket`, `XMLHttpRequest`, `require('http')`, `curl\|bash`, `wget\|bash` |
| 3 | **Comandos destructivos** | `rm -rf`, `del /f`, `mkfs`, `dd if=`, `chmod 777`, reverse shells con `nc -e` |
| 4 | **Ofuscación de payloads** | `atob()`, `Buffer.from(…, 'base64')`, `base64 -d \| bash`, strings hex largas |
| 5 | **Credenciales hardcodeadas** | API keys (`sk-`, `ghp_`, `AKIA`), tokens, contraseñas en strings |
| 6 | **👻 Ghost Prompts en Markdown** | `ignore previous instructions`, `do not tell the user`, `override safety`, `exfiltrate data`, `run_command SafeToAutoRun`, caracteres zero-width, inyecciones en comentarios HTML |

Además, al finalizar el escaneo el auditor imprime un **inventario completo de todos los prompts y directivas** encontrados en los archivos `.md`, para que puedas revisar qué instrucciones contiene cada skill.

## Método 1: Usar el repositorio oficial (Plug & Play)
1. Clona o descarga este repositorio dentro de tu carpeta global de skills (por ejemplo, en `antigravity/skills/`).
2. Ejecuta el auditor contra CUALQUIER carpeta de tu disco duro:
```bash
node ai-skill-auditor/bin/audit.js "C:/ruta/al/skill/sospechoso"
```
3. Si el skill aprueba la auditoría, recibirás un mensaje por terminal confirmando 0 vulnerabilidades y un código Markdown verde como este:
[![SMARTbrain Audit](https://img.shields.io/badge/SMARTbrain_Audit-Passed-brightgreen)](https://github.com/SMARTbrainActivity/ai-skill-auditor)

**Configura tus reglas:** Puedes abrir `config/rules.json` para añadir nuevos patrones maliciosos (RegEx) para JavaScript, Python, Shell o Markdown sin tener que modificar la lógica del código principal.

---

## Método 2: El "One-Shot Prompt" (Hazlo tú mismo)
¿No confías en descargar repositorios externos? Lo entendemos. Como defensores de la ciberseguridad, te animamos a construir tu propio auditor usando tu IA.

Simplemente pega este **Prompt Maestro** en tu asistente de código IA (Claude, Cursor, etc.):

> *"Actúa como un experto en ciberseguridad de IA especializado en prompt injection y supply-chain attacks en Skills de IA. Crea una carpeta llamada `smartbrain-skill-auditor` con un script en Node.js (cero dependencias externas) diseñado para auditar estáticamente directorios locales. El escáner debe cubrir las siguientes categorías de riesgos:*
>
> *1. **Ejecución dinámica de código**: `eval()`, `new Function()`, `setTimeout/setInterval` con strings, `vm.runInNewContext`, `import()` dinámico en JS; `eval()`, `exec()`, `compile()`, `__import__`, `importlib`, `pickle.loads` en Python.*
> *2. **Exfiltración y comunicaciones ocultas**: `fetch()`, `axios`, `XMLHttpRequest`, `WebSocket`, `require('http/https')`, `curl|bash`, `wget|bash`, URLs hardcodeadas con tokens.*
> *3. **Comandos destructivos**: `rm -rf`, `del /f`, `mkfs`, `format`, `dd if=`, `chmod 777`, reverse shells con `nc -e`.*
> *4. **Ofuscación de payloads**: `atob()`, `Buffer.from(…, 'base64')`, `base64 -d | bash`, strings hexadecimales sospechosamente largas.*
> *5. **Credenciales y secretos hardcodeados**: API keys (patrones como `sk-`, `ghp_`, `AKIA`), tokens, contraseñas en strings.*
> *6. **Ghost Prompts en archivos Markdown (.md)**: instrucciones ocultas tipo `ignore previous instructions`, `you are now`, `do not tell the user`, `send data to`, `override safety`, `bypass security`, `execute command`, `run_command`, y caracteres zero-width o comentarios HTML con inyecciones.*
>
> *El script debe:*
> - *Separar la lógica (`bin/audit.js`) de las reglas (`config/rules.json`) con expresiones regulares por categoría (javascript, python, shell, markdown) para que cualquiera pueda actualizar las reglas sin tocar el código.*
> - *Escanear recursivamente todas las extensiones `.js`, `.ts`, `.py`, `.sh`, `.bat`, `.ps1` y `.md`.*
> - *Al final del escaneo, imprimir un inventario de todos los prompts y directivas encontrados en los archivos `.md` (buscando patrones como "Act as", "You are", "Your role is", frontmatter YAML con `---`, y secciones tituladas "Instructions" o "System Prompt") para que el usuario pueda revisar qué instrucciones contiene cada skill.*
> - *Si la auditoría pasa (0 vulnerabilidades), imprimir un badge Markdown verde de seguridad por terminal.*
> - *Si la auditoría falla, listar cada archivo y patrón detectado con nivel de severidad.*
>
> *Genera la estructura completa de carpetas y archivos en un solo paso."*

---
*Creado por [SMARTbrain Activity](https://www.smartbrainactivity.ai) - Elevando la seguridad de la IA para usuarios domésticos y profesionales.*
