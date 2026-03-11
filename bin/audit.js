const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("🛡️ SMARTbrain Activity - Universal Skill Auditor v2.0");
console.log("==================================================\n");

// ---------------------------------------------------------------------------
// 1. Cargar las Reglas desde el JSON
// ---------------------------------------------------------------------------
const rulesPath = path.join(__dirname, '..', 'config', 'rules.json');
let rules = {};
try {
    const rawRules = fs.readFileSync(rulesPath, 'utf8');
    rules = JSON.parse(rawRules);
} catch (e) {
    console.error("❌ CRITICAL ERROR: No se pudo cargar config/rules.json.");
    process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Determinar la ruta a auditar
// ---------------------------------------------------------------------------
const targetArg = process.argv[2] || process.cwd();
const targetDir = path.resolve(targetArg);

if (!fs.existsSync(targetDir)) {
    console.error(`❌ ERROR: El directorio a auditar no existe -> ${targetDir}`);
    process.exit(1);
}

console.log(`🔍 Iniciando auditoría en: ${targetDir}\n`);

// ---------------------------------------------------------------------------
// 3. Estado global del escaneo
// ---------------------------------------------------------------------------
let vulnerabilities = 0;
let filesScanned = 0;
let markdownFilesScanned = 0;
const skippedDirs = ['node_modules', '.git', 'assets', 'diagrams'];
const findings = [];
const promptInventory = [];

// ---------------------------------------------------------------------------
// 4. Precompilar las RegEx de las reglas
// ---------------------------------------------------------------------------
const compiledRules = {};
for (const category of Object.keys(rules)) {
    compiledRules[category] = rules[category].map(r => ({
        regex: new RegExp(r.regex, category === 'shell' ? 'gi' : 'g'),
        name: r.name,
        severity: r.severity || 'medium'
    }));
}

// ---------------------------------------------------------------------------
// 5. Mapeo de extensiones a tipo de regla
// ---------------------------------------------------------------------------
function getFileType(filename) {
    if (filename.endsWith('.js') || filename.endsWith('.ts')) return 'javascript';
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.sh') || filename.endsWith('.bat') || filename.endsWith('.ps1')) return 'shell';
    if (filename.endsWith('.md')) return 'markdown';
    return null;
}

// ---------------------------------------------------------------------------
// 6. Extractor de Prompts en archivos Markdown
// ---------------------------------------------------------------------------
function extractPrompts(filePath, content) {
    const relativePath = path.relative(targetDir, filePath);
    const detectedPrompts = [];

    // Detectar frontmatter YAML (bloques ---)
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
        const fm = frontmatterMatch[1];
        const nameMatch = fm.match(/name:\s*(.+)/);
        const descMatch = fm.match(/description:\s*(.+)/);
        if (nameMatch || descMatch) {
            detectedPrompts.push({
                type: 'Frontmatter YAML',
                content: (nameMatch ? `name: ${nameMatch[1].trim()}` : '') +
                    (descMatch ? ` | description: ${descMatch[1].trim().substring(0, 120)}` : '')
            });
        }
    }

    // Detectar directivas de rol
    const rolePatterns = [
        { regex: /(?:^|\n).*(?:act(?:úa)?\s+(?:as|como)|you\s+are\s+(?:a|an|the)|your\s+role\s+is|eres\s+un|tu\s+rol\s+es).*$/gmi, type: 'Directiva de rol' },
        { regex: /(?:^|\n).*(?:instructions?\s+for|instrucciones?\s+para).*(?:ai|assistant|agent|asistente|agente).*$/gmi, type: 'Instrucciones para el agente' },
        { regex: /(?:^|\n)#+\s*(?:instructions?|instrucciones|system\s*prompt|prompt\s*del\s*sistema)/gmi, type: 'Sección de instrucciones' }
    ];

    rolePatterns.forEach(pattern => {
        let match;
        while ((match = pattern.regex.exec(content)) !== null) {
            const line = match[0].trim().substring(0, 150);
            if (line.length > 5) {
                detectedPrompts.push({ type: pattern.type, content: line });
            }
        }
    });

    if (detectedPrompts.length > 0) {
        promptInventory.push({ file: relativePath, prompts: detectedPrompts });
    }
}

// ---------------------------------------------------------------------------
// 7. Escaneo de archivos
// ---------------------------------------------------------------------------
function scanFile(filePath) {
    // Omite este propio script
    if (path.basename(filePath) === 'audit.js') return;

    const fileType = getFileType(filePath);
    if (!fileType) return;

    filesScanned++;
    if (fileType === 'markdown') markdownFilesScanned++;

    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(targetDir, filePath);

    // Si es markdown, extraer inventario de prompts
    if (fileType === 'markdown') {
        extractPrompts(filePath, content);
    }

    const typeRules = compiledRules[fileType];
    if (!typeRules) return;

    typeRules.forEach(pattern => {
        // Resetear el lastIndex para cada test (RegExp con flag g)
        pattern.regex.lastIndex = 0;
        if (pattern.regex.test(content)) {
            vulnerabilities++;
            const severityIcon = pattern.severity === 'critical' ? '🚨' :
                pattern.severity === 'high' ? '⚠️' : 'ℹ️';
            const severityLabel = pattern.severity.toUpperCase();
            findings.push({
                file: relativePath,
                rule: pattern.name,
                severity: pattern.severity
            });
            console.error(`\x1b[31m[${severityIcon} ${severityLabel}]\x1b[0m ${relativePath} -> ${pattern.name}`);
        }
    });
}

// ---------------------------------------------------------------------------
// 8. Recorrido recursivo del directorio
// ---------------------------------------------------------------------------
function walkDir(currentDirPath) {
    fs.readdirSync(currentDirPath).forEach(name => {
        // Omitir cualquier directorio que esté en la lista de ignorados
        if (skippedDirs.includes(name)) return;

        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            scanFile(filePath);
        } else if (stat.isDirectory()) {
            walkDir(filePath);
        }
    });
}

// ---------------------------------------------------------------------------
// 9. Ejecutar el escaneo
// ---------------------------------------------------------------------------
walkDir(targetDir);

// ---------------------------------------------------------------------------
// 10. Informe de inventario de prompts encontrados en .md
// ---------------------------------------------------------------------------
if (promptInventory.length > 0) {
    console.log("\n==================================================");
    console.log("📋 INVENTARIO DE PROMPTS DETECTADOS EN ARCHIVOS .md");
    console.log("==================================================\n");
    promptInventory.forEach(entry => {
        console.log(`  📄 ${entry.file}`);
        entry.prompts.forEach(p => {
            console.log(`     └─ [${p.type}] ${p.content}`);
        });
        console.log('');
    });
    console.log(`  Total: ${promptInventory.length} archivo(s) con directivas de prompt.\n`);
}

// ---------------------------------------------------------------------------
// 11. Resumen final
// ---------------------------------------------------------------------------
console.log("==================================================");
console.log(`📊 Resumen: ${filesScanned} archivos escaneados (${markdownFilesScanned} archivos .md)`);

if (vulnerabilities === 0) {
    console.log(`\x1b[32m✅ AUDITORÍA APROBADA: 0 vulnerabilidades encontradas.\x1b[0m`);
    console.log("Este repositorio/skill es considerado SEGURO estadísticamente.");
    console.log("\n--- Puedes copiar el siguiente Badge para tu README ---");
    console.log("[![SMARTbrain Audit](https://img.shields.io/badge/SMARTbrain_Audit-Passed-brightgreen)](https://github.com/SMARTbrainActivity/ai-skill-auditor)");
    console.log("-------------------------------------------------------\n");
    process.exit(0);
} else {
    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const highCount = findings.filter(f => f.severity === 'high').length;
    const mediumCount = findings.filter(f => f.severity === 'medium').length;
    const ghostCount = findings.filter(f => f.rule.includes('GHOST PROMPT')).length;

    console.error(`\x1b[31m❌ AUDITORÍA FALLIDA: ${vulnerabilities} patrón(es) sospechoso(s) detectado(s).\x1b[0m`);
    console.log(`   🚨 Críticos: ${criticalCount}  |  ⚠️ Altos: ${highCount}  |  ℹ️ Medios: ${mediumCount}`);
    if (ghostCount > 0) {
        console.log(`   👻 Ghost Prompts detectados: ${ghostCount}`);
    }
    console.log("\nNo ejecutes estos scripts hasta no validar manualmente el código fuente.");
    process.exit(1);
}
