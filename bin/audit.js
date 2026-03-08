const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("🛡️ SMARTbrain Activity - Universal Skill Auditor");
console.log("==================================================\n");

// 1. Cargar las Reglas desde el JSON
const rulesPath = path.join(__dirname, '..', 'config', 'rules.json');
let rules = {};
try {
    const rawRules = fs.readFileSync(rulesPath, 'utf8');
    rules = JSON.parse(rawRules);
} catch (e) {
    console.error("❌ CRITICAL ERROR: No se pudo cargar config/rules.json.");
    process.exit(1);
}

// 2. Determinar la ruta a auditar (argumento 1, o la carpeta actual si no hay)
const targetArg = process.argv[2] || process.cwd();
const targetDir = path.resolve(targetArg);

if (!fs.existsSync(targetDir)) {
    console.error(`❌ ERROR: El directorio a auditar no existe -> ${targetDir}`);
    process.exit(1);
}

console.log(`🔍 Iniciando auditoría en: ${targetDir}\n`);

let vulnerabilities = 0;
let filesScanned = 0;
let skippedDirs = ['node_modules', '.git', 'assets'];

// Precompilar las RegEx de las reglas
const compiledRules = {
    javascript: rules.javascript.map(r => ({ regex: new RegExp(r.regex, 'g'), name: r.name })),
    python: rules.python.map(r => ({ regex: new RegExp(r.regex, 'g'), name: r.name })),
    shell: rules.shell.map(r => ({ regex: new RegExp(r.regex, 'gi'), name: r.name }))
};

function getFileType(filename) {
    if (filename.endsWith('.js') || filename.endsWith('.ts')) return 'javascript';
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.sh') || filename.endsWith('.bat') || filename.endsWith('.ps1')) return 'shell';
    return null; // Archivo no auditable (md, json, png, etc.)
}

function scanFile(filePath) {
    // Omite este propio script
    if (path.basename(filePath) === 'audit.js') return;

    const fileType = getFileType(filePath);
    if (!fileType) return; // Ignore non-executable files

    filesScanned++;
    const content = fs.readFileSync(filePath, 'utf8');
    let fileIsClean = true;

    const typeRules = compiledRules[fileType];

    typeRules.forEach(pattern => {
        if (pattern.regex.test(content)) {
            vulnerabilities++;
            fileIsClean = false;
            console.error(`\x1b[31m[🚨 WARNING]\x1b[0m ${filePath} -> ${pattern.name}`);
        }
    });

    if (fileIsClean) {
        // Opcional: Console log para verbose
        // console.log(`[PASS] ${path.basename(filePath)} verificado: Limpio.`);
    }
}

function walkDir(currentDirPath) {
    fs.readdirSync(currentDirPath).forEach(name => {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            scanFile(filePath);
        } else if (stat.isDirectory() && !skippedDirs.includes(name)) {
            walkDir(filePath);
        }
    });
}

// 3. Iniciar el recorrido recursivo
walkDir(targetDir);

console.log("\n==================================================");
if (vulnerabilities === 0) {
    console.log(`\x1b[32m✅ AUDITORÍA APROBADA: 0 vulnerabilidades críticas encontradas en ${filesScanned} archivos ejecutables.\x1b[0m`);
    console.log("Este repositorio/skill es considerado SEGURO estadísticamente.");
    console.log("\n--- Puedes copiar el siguiente Badge para tu README ---");
    console.log("[![SMARTbrain Audit](https://img.shields.io/badge/SMARTbrain_Audit-Passed-brightgreen)](https://github.com/SMARTbrainActivity/ai-skill-auditor)");
    console.log("-------------------------------------------------------\n");
    process.exit(0);
} else {
    console.error(`\x1b[31m❌ AUDITORÍA FALLIDA: ${vulnerabilities} vulnerabilidades críticas o patrones sospechosos detectados.\x1b[0m`);
    console.log("No ejecutes estos scripts hasta no validar manualmente el código fuente.");
    process.exit(1);
}
