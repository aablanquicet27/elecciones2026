# 🗳️ Análisis Electoral Colombia 2026 - Tiempo Real

Sistema de análisis y visualización de datos electorales en tiempo real para las Elecciones Presidenciales de Colombia 2026.

## 🚀 Características

- **Scraping en tiempo real** desde Wikipedia usando FireCrawl
- **Análisis automático** con Python (pandas, matplotlib, seaborn)
- **Visualizaciones interactivas** de tendencias políticas
- **Datos históricos** de múltiples encuestadoras
- **Actualización automática** cada 2 horas
- **API REST** para integración con aplicaciones web

## 📦 Instalación

### Dependencias de Node.js
```bash
npm install
```

### Dependencias de Python
```bash
pip install -r requirements.txt
```

## 🎯 Uso

### Comandos Rápidos

```bash
# Actualización completa (scraping + análisis + visualizaciones)
npm run update-full

# Actualización rápida (solo scraping)
npm run update-quick

# Solo scraping de datos
npm run scrape

# Solo análisis con Python
npm run analyze
```

### Uso Programático

```javascript
import { updateElectionData, getLatestData } from './scripts/automation.js';

// Actualización completa
const result = await updateElectionData('full');

// Obtener datos más recientes
const data = await getLatestData();
```

## 📊 Visualizaciones Generadas

1. **Intención de voto principal** - Top 10 candidatos
2. **Tendencias políticas** - Agrupación por Izquierda/Centro/Derecha
3. **Evolución histórica** - Cambios en el tiempo
4. **Comparación entre encuestadoras** - Diferentes casas encuestadoras

## 📁 Estructura de Archivos

```
├── scripts/
│   ├── scraper.js           # Scraping con FireCrawl
│   ├── real_time_analysis.py # Análisis y visualizaciones
│   ├── automation.js        # Orquestación completa
│   └── script.py           # Script original (estático)
├── visualizations/          # Gráficos generados
├── data/                   # Datos procesados (CSV)
├── logs/                   # Logs de actualizaciones
└── src/                    # Aplicación web React
```

## 🔄 Automatización

El sistema está configurado para:
- Actualizar datos cada 2 horas
- Generar visualizaciones automáticamente
- Mantener histórico de encuestas
- Logs de todas las actualizaciones

## 🌐 Fuentes de Datos

- **Wikipedia**: Anexo de sondeos de intención de voto
- **FireCrawl API**: Extracción estructurada de datos
- **Múltiples encuestadoras**: Guarumo/EcoAnalítica, Invamer, CNC

## 📈 Candidatos Monitoreados

Incluyendo a todos los candidatos con más del 1% de intención de voto:
- Gustavo Bolívar, Vicky Dávila, Sergio Fajardo
- Claudia López, Alejandro Gaviria, Francia Márquez
- Y más...

## 🛠️ Desarrollo

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build
```

## 📝 Configuración

### API Key de FireCrawl
Actualizar en `scripts/scraper.js`:
```javascript
const app = new FireCrawlApp({apiKey: "tu-api-key-aqui"});
```

### Personalización de Candidatos
Modificar las tendencias políticas en `scripts/real_time_analysis.py`:
```python
tendencias = {
    'Candidato': 'Tendencia',
    # ...
}
```
