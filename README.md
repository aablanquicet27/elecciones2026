# 🗳️ Elecciones Colombia 2026

> Plataforma web de análisis electoral en tiempo real para las Elecciones Presidenciales y Legislativas de Colombia 2026.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Edge_Functions-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/Licencia-MIT-green)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Páginas](#-páginas)
- [AI Chat](#-ai-chat)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Setup Local](#-setup-local)
- [Variables de Entorno](#-variables-de-entorno)
- [Deploy](#-deploy)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 📌 Descripción

**Elecciones Colombia 2026** es una plataforma de análisis electoral open source que centraliza datos de encuestas, perfiles de candidatos y tendencias políticas en una sola interfaz moderna. Combina visualizaciones interactivas con un chat de inteligencia artificial capaz de responder preguntas electorales en tiempo real usando búsqueda web.

El proyecto está pensado para periodistas, analistas políticos, académicos y ciudadanos que quieran hacer seguimiento riguroso al proceso electoral colombiano.

---

## ✨ Features

### 📊 Datos y Visualizaciones
- **Promedio tipo RealClearPolitics** — promedio ponderado de encuestadoras (Guarumo/EcoAnalítica, Invamer, CNC, Datexco)
- **Intención de voto** por candidato, región, grupo etario y generación
- **Favorabilidad** e imagen de candidatos presidenciales
- **Escenarios de segunda vuelta** con gráficos comparativos
- **Análisis de tendencias** históricas de encuestas
- **Análisis regional y demográfico** detallado

### 🏛️ Módulo Senado
- Partidos políticos con escaños actuales
- Tabla de congresistas con señalamientos por corrupción
- Guía de votación para ciudadanos
- Estadísticas generales del Senado

### 🤖 Chat IA
- Asistente electoral con GPT-5.2
- Búsqueda en tiempo real vía Exa AI
- Componentes visuales embebidos en el chat (tarjetas, comparaciones, rankings, stats)

### 📰 Noticias
- Noticias del día sobre las elecciones colombianas
- Alimentadas por Supabase Edge Function (`fetch-news`)

### 📱 PWA
- Instalable en dispositivos móviles y desktop
- Service Worker para funcionamiento offline
- Manifest con categorías, shortcuts e íconos

### 📈 Analytics
- Vercel Analytics integrado para métricas de uso

---

## 🛠️ Tech Stack

| Capa | Tecnología |
|---|---|
| Framework UI | React 19 |
| Lenguaje | TypeScript 5.5 |
| Build tool | Vite 5.4 |
| Estilos | Tailwind CSS 3.4 + `@tailwindcss/typography` |
| Routing | React Router DOM 6 |
| Iconos | Lucide React |
| Markdown | react-markdown + remark-gfm |
| Backend / DB | Supabase (Edge Functions + Storage) |
| IA | OpenAI GPT-5.2 + Exa AI (búsqueda web) |
| Noticias | Supabase Edge Function `fetch-news` |
| Analytics | Vercel Analytics |
| Deploy | Vercel |
| PWA | manifest.json + Service Worker |
| Datos | CSVs públicos (encuestas, favorabilidad, regiones, edades) |

---

## 📄 Páginas

### `/` — Dashboard Principal (`HomePage`)
El corazón de la plataforma. Incluye:
- Grid de candidatos presidenciales (`CandidateGrid`)
- Tabla de promedio de encuestas (`PollAverageTable`)
- Gráfico de intención de voto (`VotingIntentionChart`)
- Gráfico de favorabilidad (`FavorabilityChart`)
- Escenarios de segunda vuelta (`ScenarioChart`)
- Análisis de tendencias (`TrendChart`, `TrendAnalysis`)
- Vista previa de noticias (`NoticiasPreview`)
- Estadísticas generales (`StatsOverview`, `StatCard`)
- Sección de insights electorales (`ElectoralInsights`)

### `/candidato/:slug` — Perfil de Candidato (`CandidatePage`)
Perfil individual de cada candidato presidencial con datos biográficos, posiciones políticas, evolución en encuestas y comparativas.

### `/analisis` — Análisis Electoral (`AnalysisPage`)
Análisis profundo con:
- Gráficos comparativos (`ComparisonChart`)
- Distribución demográfica (`DemographicChart`)
- Análisis generacional (`GenerationChart`)
- Mapas y gráficos regionales (`RegionalChart`, `RegionalMap`)
- Presencia en redes sociales (`SocialMediaChart`)
- Línea de tiempo electoral (`TimelineSection`)

### `/noticias` — Noticias del Día (`NoticiasPage`)
Noticias recientes sobre las elecciones colombianas, obtenidas mediante la Edge Function `fetch-news`.

### `/senado` — Análisis del Senado (`SenadoPage`)
Módulo completo sobre el Senado de la República:
- Hero informativo (`SenadoHero`)
- Estadísticas clave (`SenadoStats`)
- Grid de partidos políticos (`SenadoPartyGrid`)
- Tabla de corrupción (`SenadoCorruptionTable`)
- Guía ciudadana de votación (`SenadoVotingGuide`)
- Fuentes y referencias (`SenadoFuentes`)
- CTA de suscripción (`SenadoCTA`)

---

## 🤖 AI Chat

El componente `AIChatBubble` es un asistente electoral flotante que aparece en todas las páginas.

### Arquitectura

```
Usuario → AIChatBubble (React)
            ↓
       Supabase Edge Function: chat-ai
            ↓
       OpenAI GPT-5.2  +  Exa AI (búsqueda web en tiempo real)
            ↓
       Respuesta con componentes visuales embebidos
```

### Componentes visuales del chat (`src/components/chat/`)

| Componente | Descripción |
|---|---|
| `CandidateCard` | Tarjeta individual de candidato |
| `CandidateComparison` | Comparación lado a lado de candidatos |
| `ElectoralStats` | Estadísticas electorales en tarjetas |
| `ElectoralInsight` | Insights y análisis destacados |

El modelo detecta la intención del usuario y decide si renderizar texto plano o uno de estos componentes enriquecidos directamente en el hilo de conversación.

---

## 🗂️ Estructura del Proyecto

```
elecciones2026/
├── public/
│   ├── manifest.json                          # PWA manifest
│   ├── sw.js                                  # Service Worker
│   ├── candidatos_presidenciales_2026_completo.csv
│   ├── favorabilidad_candidatos_2026.csv
│   ├── escenarios_segunda_vuelta_2026.csv
│   ├── intencion_voto_regiones_2026.csv
│   ├── intencion_voto_edades_2026.csv
│   ├── comparacion_2022_2026.csv
│   ├── presencia_redes_sociales_2026.csv
│   ├── perfiles_candidatos.json
│   └── election-data.json
│
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── CandidatePage.tsx
│   │   ├── AnalysisPage.tsx
│   │   ├── NoticiasPage.tsx
│   │   └── SenadoPage.tsx
│   │
│   ├── components/
│   │   ├── AIChatBubble.tsx                   # Chat IA principal
│   │   ├── chat/                              # Componentes del chat
│   │   │   ├── CandidateCard.tsx
│   │   │   ├── CandidateComparison.tsx
│   │   │   ├── ElectoralStats.tsx
│   │   │   └── ElectoralInsight.tsx
│   │   ├── senado/                            # Módulo Senado
│   │   │   ├── SenadoHero.tsx
│   │   │   ├── SenadoStats.tsx
│   │   │   ├── SenadoPartyGrid.tsx
│   │   │   ├── SenadoCorruptionTable.tsx
│   │   │   ├── SenadoVotingGuide.tsx
│   │   │   ├── SenadoFuentes.tsx
│   │   │   └── SenadoCTA.tsx
│   │   ├── VotingIntentionChart.tsx
│   │   ├── FavorabilityChart.tsx
│   │   ├── ScenarioChart.tsx
│   │   ├── TrendChart.tsx
│   │   ├── ComparisonChart.tsx
│   │   ├── DemographicChart.tsx
│   │   ├── GenerationChart.tsx
│   │   ├── RegionalChart.tsx
│   │   ├── RegionalMap.tsx
│   │   ├── SocialMediaChart.tsx
│   │   ├── PollAverageTable.tsx
│   │   ├── CandidateCard.tsx
│   │   ├── CandidateGrid.tsx
│   │   ├── CandidateTable.tsx
│   │   ├── SubscriptionModal.tsx
│   │   └── ...
│   │
│   ├── data/
│   │   ├── pollAverages.ts                    # Datos de promedio de encuestas
│   │   └── senadoData.ts                      # Datos del Senado
│   │
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── supabase/
│   └── functions/
│       ├── chat-ai/                           # Edge Function: IA + Exa search
│       └── fetch-news/                        # Edge Function: noticias
│
├── vercel.json                                # SPA rewrites
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Setup Local

### Prerrequisitos

- Node.js 18+
- npm 9+
- Cuenta en [Supabase](https://supabase.com/) (para el chat IA y noticias)
- API Key de [OpenAI](https://platform.openai.com/)
- API Key de [Exa AI](https://exa.ai/) (para búsqueda en tiempo real)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/aablanquicet27/elecciones2026.git
cd elecciones2026

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver sección Variables de Entorno)

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo con hot reload
npm run build     # Build de producción en /dist
npm run preview   # Vista previa del build de producción
npm run lint      # Linter con ESLint
```

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`.

### Frontend (Vite)

```env
# URL de tu proyecto en Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co

# Clave anon/pública de Supabase (segura para el frontend)
VITE_SUPABASE_ANON_KEY=

# API Key de OpenAI (solo si haces llamadas directas desde el frontend)
VITE_OPENAI_API_KEY=sk-...
```

> ⚠️ **Importante:** Nunca expongas `OPENAI_API_KEY` o `EXA_API_KEY` directamente en el frontend. Estas deben vivir únicamente como secretos de Supabase Edge Functions.

### Supabase Edge Functions (secretos del servidor)

Configúralos desde el dashboard de Supabase → *Settings → Edge Functions → Secrets*, o con la CLI:

```bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set EXA_API_KEY=exakey-...
```

| Variable | Descripción |
|---|---|
| `OPENAI_API_KEY` | API Key de OpenAI para GPT-5.2 |
| `EXA_API_KEY` | API Key de Exa AI para búsqueda web en tiempo real |

---

## 🌐 Deploy

El proyecto está configurado para deploy automático en **Vercel**.

### Deploy en Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com/)
2. Configurar las variables de entorno en *Settings → Environment Variables*:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Vercel detecta automáticamente Vite y ejecuta `npm run build`
4. El archivo `vercel.json` configura las rewrites necesarias para el routing SPA:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deploy de Supabase Edge Functions

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Desplegar funciones
supabase functions deploy chat-ai
supabase functions deploy fetch-news
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/mi-feature`
3. Haz commit de tus cambios: `git commit -m 'feat: descripción del cambio'`
4. Push a tu rama: `git push origin feature/mi-feature`
5. Abre un Pull Request

### Convención de commits

Se usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     nueva funcionalidad
fix:      corrección de bug
docs:     cambios en documentación
style:    formato, sin cambios de lógica
refactor: refactorización de código
chore:    tareas de mantenimiento
```

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <p>Hecho con ❤️ para la democracia colombiana</p>
  <p>🇨🇴 <strong>Elecciones Colombia 2026</strong> — Análisis electoral transparente y accesible</p>
</div>
