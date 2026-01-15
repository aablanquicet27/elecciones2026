# Datos Electorales Colombia 2026 - Atlas Intel

**Encuesta Base:** Atlas Intel para Revista Semana
**Fecha de Levantamiento:** 5-8 de enero de 2026
**Muestra:** 4,520 personas (Muestreo digital aleatorio Atlas RDR)
**Margen de Error:** 1% (intención directa) | 3% (consultas interpartidistas)
**Nivel de Confianza:** 95%

## Archivos Generados

### 1. **favorabilidad_2026.csv**
Datos de favorable/desfavorable/NS-NR por candidato
- Ültima actualización de la imagen pública de cada aspirante
- Comparación de fortalezas/debilidades de candidatos
- Uso: Gráficos de radar, tarjetas de candidato, análisis de percepción

### 2. **primera_vuelta_escenarios_2026.csv**
Tres escenarios de primera vuelta (31 de mayo 2026)
- **Escenario 1:** Todos los candidatos (16 nombres)
- **Escenario 2:** Top 4 candidatos 
- **Escenario 3:** Top 3 candidatos
- Uso: Visualización de concentración de voto, tendencias por escenario

### 3. **segunda_vuelta_balotajes_2026.csv**
Once (11) escenarios de segunda vuelta (21 de junio 2026)
- Todos los balotajes posibles entre principales candidatos
- Comparación directa: De la Espriella vs Cepeda (+9.3 puntos)
- Uso: Visualización de confrontaciones, predicciones de ganador

### 4. **consultas_internas_2026.csv**
Dos consultas internas (votación simultanes 8 de marzo 2026)
- **Gran Consulta por Colombia:** 8 candidatos centro-derecha (18.7% participación esperada)
- **Pacto Amplio:** 4 candidatos izquierda (29.8% participación esperada)
- Uso: Comparación de fuerzas políticas, predicciones de candidatos definidos

## Hallazgos Clave

### Primera Vuelta (Escenario 1 - Todos)
1. **Abelardo de la Espriella** - 28.0% (Defensores de la Patria)
2. **Iván Cepeda** - 26.5% (Pacto Histórico)
3. **Sergio Fajardo** - 9.4% (Centro)
4. **Juan Carlos Pinzón** - 5.1% (Gran Consulta)
5. **Paloma Valencia** - 5.1% (Gran Consulta)

**Empate Técnico:** Solo 1.5 puntos porcentuales entre los dos líderes
**Indecisión:** 5.7% (ns/nr) + 7.2% (voto en blanco) = 12.9%

### Segunda Vuelta (Principales Balotajes)
- **De la Espriella vs Cepeda:** De la Espriella gana 44.2% vs 34.9% (+9.3)
- **Fajardo vs Cepeda:** Fajardo gana 39.6% vs 32.1% (+7.5)
- **Valencia vs Cepeda:** Valencia gana 38.2% vs 35.8% (+2.4 - más cerrado)

### Consultas Internas
- **Gran Consulta (Derecha):** Paloma Valencia lidera 19.1% (Sin definir candidato único)
- **Pacto Amplio (Izquierda):** Iván Cepeda domina 92.3% (Candidato ya definido)

## Cómo Integrar en elecciones2026

### Para Favorabilidad
```javascript
// En csvParser.ts - Añadir columnas comparativas
favorables: {}
desfavorables: {}
ns_nr: {}
```

### Para Escenarios de Primera Vuelta
```javascript
// Crear dropdown/tabs para cambiar entre 3 escenarios
const escenarios = [
  { nombre: 'Todos los Candidatos', dataSource: 'Escenario_1_Todos_Candidatos' },
  { nombre: 'Top 4 Candidatos', dataSource: 'Escenario_2_Top_Cuatro' },
  { nombre: 'Top 3 Candidatos', dataSource: 'Escenario_3_Top_Tres' }
]
```

### Para Balotajes (Segunda Vuelta)
```javascript
// Crear matriz interactiva de balotajes
const balotajes = [
  { vs: 'De la Espriella vs Cepeda', ventaja: '+9.3 puntos' },
  { vs: 'Fajardo vs Cepeda', ventaja: '+7.5 puntos' },
  // ... resto de balotajes
]
```

### Para Consultas Internas
```javascript
// Tab de "Decisiones Futuras" mostrando
- Gran Consulta: Ganador TBD (Paloma Valencia lidera 19.1%)
- Pacto Amplio: Candidato definido (Cepeda 92.3%)
```

## Descargas de Datos

- **CSV (Favorabilidad):** [favorabilidad_2026.csv](https://raw.githubusercontent.com/aablanquicet27/elecciones2026/main/public/data/favorabilidad_2026.csv)
- **CSV (Primera Vuelta):** [primera_vuelta_escenarios_2026.csv](https://raw.githubusercontent.com/aablanquicet27/elecciones2026/main/public/data/primera_vuelta_escenarios_2026.csv)
- **CSV (Segunda Vuelta):** [segunda_vuelta_balotajes_2026.csv](https://raw.githubusercontent.com/aablanquicet27/elecciones2026/main/public/data/segunda_vuelta_balotajes_2026.csv)
- **CSV (Consultas):** [consultas_internas_2026.csv](https://raw.githubusercontent.com/aablanquicet27/elecciones2026/main/public/data/consultas_internas_2026.csv)

## Confiabilidad

**AtlasIntel Rankings:**
- ✅ #1 Encuestadora en EE.UU. (Ranking 2025 - Nate Silver)
- ✅ Acertó elecciones 2020 y 2024 USA
- ✅ Acertó Elecciones 2022 Colombia (Mejor rendimiento)
- ✅ Acertó Argentina 2023 (Javier Milei)
- ✅ Éxitos recientes en Brasil, Chile, Sudáfrica, España

---

**Nota:** Atlas Intel es considerada la encuestadora más confiable de Latinoamérica. Estos datos representan el panorama electoral a enero 15, 2026.
