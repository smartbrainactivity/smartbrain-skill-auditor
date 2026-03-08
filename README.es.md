# Auditor de Skills de IA

![SMARTbrain Auditor](assets/banner.png)

[![Creador](https://img.shields.io/badge/Creador-SMARTbrain%20Activity-blue)](https://www.smartbrainactivity.ai)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](LICENSE)

Una herramienta universal en Node.js, sin dependencias externas, para auditar de forma estática Skills de IA y agentes locales (como los usados en Claude, Cursor, Antigravity) en busca de patrones maliciosos.

[🇬🇧 Read in English](README.md)

Antes de ejecutar directorios descargados llenos de archivos `.js`, `.py` o `.sh`, escanéalos matemáticamente para asegurar que no contienen código peligroso (uso oculto de `eval()`, peticiones HTTP maliciosas o borrados estilo `rm -rf`).

## Método 1: Usar el Repositorio Oficial (Plug & Play)
1. Clona o descarga este repositorio dentro de tu carpeta global de skills (por ejemplo, en `antigravity/skills/`).
2. Ejecuta el auditor contra CUALQUIER carpeta de tu disco duro:
```bash
node ai-skill-auditor/bin/audit.js "C:/ruta/al/skill/sospechoso"
```
3. Si el skill aprueba la auditoría, recibirás un mensaje por terminal confirmando 0 vulnerabilidades y un código Markdown verde como este:
[![SMARTbrain Audit](https://img.shields.io/badge/SMARTbrain_Audit-Passed-brightgreen)](https://github.com/SMARTbrainActivity/ai-skill-auditor)

**Configura tus reglas:** Puedes abrir `config/rules.json` para añadir nuevos patrones maliciosos (RegEx) para JavaScript, Python o Shell sin tener que modificar la lógica del código principal.

---

## Método 2: El "One-Shot Prompt" (Hazlo tú mismo)
¿No confías en descargar repositorios externos? Lo entendemos. Como defensores de la ciberseguridad, te animamos a construir tu propio auditor usando tu IA.

Simplemente pega este **Prompt Maestro** en tu asistente de código IA (Claude, Cursor, etc.):
> *"Actúa como un Experto en Ciberseguridad de IA. Crea una carpeta llamada `smartbrain-skill-auditor` con un script en Node.js (cero dependencias externas) diseñado para escanear directorios locales en busca de patrones maliciosos comunes en scripts y Skills de IA (como uso de `eval`, llamadas HTTP no autorizadas o comandos de borrado destructivo como `rm -rf`). Separa la lógica del script (`audit.js`) de un archivo JSON centralizado (`rules.json`) donde indiques las expresiones regulares maliciosas para que yo pueda actualizarlas. Al terminar de ejecutar y auditar una carpeta limpia, el script debe imprimir por terminal un escudo Markdown verde de 'Seguridad Validada'. Genera todos los archivos en un solo paso."*

---
*Creado por [SMARTbrain Activity](https://www.smartbrainactivity.ai) - Elevando la seguridad de la IA para usuarios domésticos y profesionales.*
