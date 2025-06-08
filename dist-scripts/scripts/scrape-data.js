"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var firecrawl_js_1 = require("@mendable/firecrawl-js");
var fs = require("fs");
var path = require("path");
var app = new firecrawl_js_1.default({ apiKey: "fc-2675fea820ed42bcaa712e321964f2db" });
var candidateNameMapping = {
    'Davila': 'Vicky Dávila', 'Dávila': 'Vicky Dávila', 'Galán': 'Juan Manuel Galán', 'Fajardo': 'Sergio Fajardo',
    'López': 'Claudia López', 'Cabal': 'María Fernanda Cabal', 'Botero': 'Santiago Botero Jaramillo',
    'Luna': 'David Luna', 'Pizarro': 'María José Pizarro', 'Gaviria': 'Alejandro Gaviria',
    'Quintero': 'Daniel Quintero', 'Vargas': 'Germán Vargas Lleras', 'Bolívar': 'Gustavo Bolívar',
    'Oviedo': 'Juan Daniel Oviedo', 'Uribe': 'Miguel Uribe Turbay', 'Peñalosa': 'Enrique Peñalosa',
    'Caicedo': 'Carlos Eduardo Caicedo', 'Muhamad': 'Susana Muhamad', 'Murillo': 'Luis Gilberto Murillo',
    'Valencia': 'Paloma Valencia', 'Corcho': 'Carolina Corcho', 'Romero': 'Camilo Romero', 'Cepeda': 'Iván Cepeda'
};
var politicalTendencyMapping = {
    'Vicky Dávila': 'Derecha', 'Juan Manuel Galán': 'Centro', 'Sergio Fajardo': 'Centro',
    'Claudia López': 'Centro', 'María Fernanda Cabal': 'Derecha', 'Santiago Botero Jaramillo': 'Centro',
    'David Luna': 'Derecha', 'María José Pizarro': 'Izquierda', 'Alejandro Gaviria': 'Centro',
    'Daniel Quintero': 'Izquierda', 'Germán Vargas Lleras': 'Derecha', 'Gustavo Bolívar': 'Izquierda',
    'Juan Daniel Oviedo': 'Centro', 'Miguel Uribe Turbay': 'Derecha', 'Enrique Peñalosa': 'Centro',
    'Carlos Eduardo Caicedo': 'Izquierda', 'Susana Muhamad': 'Izquierda', 'Luis Gilberto Murillo': 'Centro',
    'Paloma Valencia': 'Derecha', 'Carolina Corcho': 'Izquierda', 'Camilo Romero': 'Centro', 'Iván Cepeda': 'Izquierda'
};
var candidateAdditionalData = {
    'Vicky Dávila': { Favorabilidad: 38, Desfavorabilidad: 44, Partido_Movimiento: 'Candidata por firmas', Región_Origen: 'Valle del Cauca', Cargo_Actual: 'Ex-Directora Semana', Edad: 58, Generación: 'Mayor (51-60)', Tipo_Candidatura: 'Por firmas' },
    'Juan Manuel Galán': { Favorabilidad: 40, Desfavorabilidad: 28, Partido_Movimiento: 'Nuevo Liberalismo', Región_Origen: 'Bogotá', Cargo_Actual: 'Ex-Senador', Edad: 61, Generación: 'Senior (>60)', Tipo_Candidatura: 'Por partido' },
    'Sergio Fajardo': { Favorabilidad: 42, Desfavorabilidad: 32, Partido_Movimiento: 'Centro Esperanza', Región_Origen: 'Antioquia', Cargo_Actual: 'Ex-Gobernador de Antioquia', Edad: 67, Generación: 'Senior (>60)', Tipo_Candidatura: 'Por partido' },
    'Claudia López': { Favorabilidad: 31, Desfavorabilidad: 45, Partido_Movimiento: 'Candidata por firmas', Región_Origen: 'Bogotá', Cargo_Actual: 'Ex-Alcaldesa de Bogotá', Edad: 54, Generación: 'Mayor (51-60)', Tipo_Candidatura: 'Por firmas' },
    'María Fernanda Cabal': { Favorabilidad: 27, Desfavorabilidad: 56, Partido_Movimiento: 'Centro Democrático', Región_Origen: 'Valle del Cauca', Cargo_Actual: 'Senadora', Edad: 58, Generación: 'Mayor (51-60)', Tipo_Candidatura: 'Por partido' },
    'Gustavo Bolívar': { Favorabilidad: 34, Desfavorabilidad: 48, Partido_Movimiento: 'Pacto Histórico', Región_Origen: 'Bogotá', Cargo_Actual: 'Ex-director Prosperidad Social', Edad: 63, Generación: 'Senior (>60)', Tipo_Candidatura: 'Por partido' },
    'Germán Vargas Lleras': { Favorabilidad: 29, Desfavorabilidad: 54, Partido_Movimiento: 'Cambio Radical', Región_Origen: 'Cundinamarca', Cargo_Actual: 'Ex-Vicepresidente', Edad: 65, Generación: 'Senior (>60)', Tipo_Candidatura: 'Por partido' },
    'Daniel Quintero': { Favorabilidad: 23, Desfavorabilidad: 58, Partido_Movimiento: 'Candidato por firmas', Región_Origen: 'Antioquia', Cargo_Actual: 'Ex-Alcalde de Medellín', Edad: 44, Generación: 'Adulto (41-50)', Tipo_Candidatura: 'Por firmas' },
    'María José Pizarro': { Favorabilidad: 29, Desfavorabilidad: 41, Partido_Movimiento: 'Pacto Histórico', Región_Origen: 'Bogotá', Cargo_Actual: 'Senadora', Edad: 46, Generación: 'Adulto (41-50)', Tipo_Candidatura: 'Por partido' },
    'Miguel Uribe Turbay': { Favorabilidad: 32, Desfavorabilidad: 40, Partido_Movimiento: 'Centro Democrático', Región_Origen: 'Bogotá', Cargo_Actual: 'Senador', Edad: 39, Generación: 'Joven (≤40)', Tipo_Candidatura: 'Por partido' }
};
function parsePollingTable(markdownContent) {
    var lines = markdownContent.split('\n');
    var candidatePercentages = {};
    var inTable = false;
    var candidateColumns = [];
    var tableStarted = false;
    var _loop_1 = function (line) {
        var trimmedLine = line.trim();
        if (trimmedLine.includes('### 2025')) {
            tableStarted = true;
            return "continue";
        }
        if (tableStarted && trimmedLine.startsWith('|')) {
            var parts = trimmedLine.split('|').map(function (p) { return p.trim(); }).filter(Boolean);
            if (parts[0] === 'Fecha' && parts[1] === 'Encuestadora') {
                inTable = true;
                candidateColumns = parts.slice(3, -1);
            }
            else if (inTable && !trimmedLine.includes('---')) {
                var rowData_1 = parts.slice(3, -1);
                candidateColumns.forEach(function (col, index) {
                    var standardizedName = candidateNameMapping[col.trim()] || col.trim();
                    var percentageMatch = rowData_1[index] ? rowData_1[index].match(/([\d.,]+)%?/) : null;
                    if (standardizedName && percentageMatch) {
                        var percentage = parseFloat(percentageMatch[1].replace(',', '.'));
                        if (!candidatePercentages[standardizedName]) {
                            candidatePercentages[standardizedName] = percentage;
                        }
                    }
                });
                if (Object.keys(candidatePercentages).length > 0)
                    return "break";
            }
        }
        if (tableStarted && trimmedLine.includes('### 2024')) {
            return "break";
        }
    };
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var state_1 = _loop_1(line);
        if (state_1 === "break")
            break;
    }
    return candidatePercentages;
}
function scrapeAndSaveData() {
    return __awaiter(this, void 0, void 0, function () {
        var scrapeResult, markdownContent, markdownPath, candidatePercentages, sortedCandidates, candidates, outputPath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('Scraping data from Wikipedia...');
                    return [4 /*yield*/, app.scrapeUrl("https://es.wikipedia.org/wiki/Anexo:Sondeos_de_intenci%C3%B3n_de_voto_para_las_elecciones_presidenciales_de_Colombia_de_2026")];
                case 1:
                    scrapeResult = _a.sent();
                    if (!scrapeResult || !scrapeResult.markdown) {
                        console.error('FireCrawl scrape failed:', scrapeResult);
                        throw new Error('Failed to scrape Wikipedia page');
                    }
                    console.log('Parsing scraped data...');
                    markdownContent = scrapeResult.markdown;
                    markdownPath = path.join(__dirname, '..', 'debug_markdown.md');
                    fs.writeFileSync(markdownPath, markdownContent);
                    console.log("Markdown content saved to ".concat(markdownPath));
                    candidatePercentages = parsePollingTable(markdownContent);
                    // Debugging: Log parsed percentages
                    console.log('Parsed candidate percentages:', candidatePercentages);
                    if (Object.keys(candidatePercentages).length === 0) {
                        throw new Error('Could not parse candidate percentages from the markdown.');
                    }
                    sortedCandidates = Object.entries(candidatePercentages)
                        .sort(function (_a, _b) {
                        var a = _a[1];
                        var b = _b[1];
                        return b - a;
                    });
                    candidates = sortedCandidates.map(function (_a, index) {
                        var name = _a[0], percentage = _a[1];
                        var additionalData = candidateAdditionalData[name] || {};
                        return {
                            Candidato: name,
                            Intención_Voto_Porcentaje: percentage,
                            Tendencia_Política: politicalTendencyMapping[name] || 'Desconocido',
                            Favorabilidad: additionalData.Favorabilidad || 30,
                            Desfavorabilidad: additionalData.Desfavorabilidad || 40,
                            Partido_Movimiento: additionalData.Partido_Movimiento || 'TBD',
                            Región_Origen: additionalData.Región_Origen || 'TBD',
                            Cargo_Actual: additionalData.Cargo_Actual || 'TBD',
                            Edad: additionalData.Edad || 50,
                            Ranking: index + 1,
                            Generación: additionalData.Generación || 'Adulto (41-50)',
                            Tipo_Candidatura: additionalData.Tipo_Candidatura || 'Por partido',
                        };
                    });
                    outputPath = path.join(__dirname, '..', 'public', 'election-data.json');
                    console.log("Saving data to ".concat(outputPath, "..."));
                    fs.writeFileSync(outputPath, JSON.stringify(candidates, null, 2));
                    console.log('Data saved successfully!');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error during scraping process:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
scrapeAndSaveData();
