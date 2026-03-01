import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Candidatos y partidos conocidos del proyecto
const CANDIDATOS = [
  "Iván Cepeda", "Abelardo de la Espriella", "Claudia López", "Paloma Valencia",
  "Sergio Fajardo", "Clara López", "Santiago Botero", "Roy Barreras",
  "Miguel Uribe Londoño", "Luis Gilberto Murillo", "Carlos Caicedo",
  "Luis Carlos Reyes", "Daniel Palacios", "Maurice Armitage",
  "Mauricio Lizcano", "Sondra Macollins", "Juan Fernando Cristo",
];

// Apellidos para matching parcial
const CANDIDATOS_APELLIDOS: Record<string, string> = {
  "Cepeda": "Iván Cepeda",
  "Espriella": "Abelardo de la Espriella",
  "Paloma": "Paloma Valencia",
  "Fajardo": "Sergio Fajardo",
  "Barreras": "Roy Barreras",
  "Uribe Londoño": "Miguel Uribe Londoño",
  "Murillo": "Luis Gilberto Murillo",
  "Caicedo": "Carlos Caicedo",
  "Armitage": "Maurice Armitage",
  "Lizcano": "Mauricio Lizcano",
  "Cristo": "Juan Fernando Cristo",
};

const PARTIDOS = [
  "Pacto Histórico", "Centro Democrático", "Partido de la U",
  "Movimiento Defensores de la Patria", "Con Claudia Imparables",
  "Dignidad y Compromiso", "Partido Liberal", "Partido Conservador",
  "Cambio Radical", "Alianza Verde", "Polo Democrático",
];

const QUERIES = [
  "elecciones presidenciales Colombia 2026",
  "candidatos presidenciales Colombia 2026",
  "encuestas elecciones Colombia 2026",
];

function extractCandidates(text: string): string[] {
  const found = new Set<string>();
  const lower = text.toLowerCase();

  for (const c of CANDIDATOS) {
    if (lower.includes(c.toLowerCase())) {
      found.add(c);
    }
  }
  for (const [apellido, nombre] of Object.entries(CANDIDATOS_APELLIDOS)) {
    if (lower.includes(apellido.toLowerCase())) {
      found.add(nombre);
    }
  }
  return [...found];
}

function extractParties(text: string): string[] {
  const found = new Set<string>();
  const lower = text.toLowerCase();

  for (const p of PARTIDOS) {
    if (lower.includes(p.toLowerCase())) {
      found.add(p);
    }
  }
  return [...found];
}

function hashUrl(url: string): string {
  // Simple hash for dedup
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const exaApiKey = Deno.env.get("EXA_API_KEY");
    if (!exaApiKey) {
      throw new Error("EXA_API_KEY no está configurada");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get date of last article in DB
    const { data: lastArticle } = await supabase
      .from("noticias_historial")
      .select("date")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    const startDate = lastArticle?.date || "2026-01-15";
    console.log(`Fetching news since: ${startDate}`);

    let totalInserted = 0;
    let totalSkipped = 0;

    for (const query of QUERIES) {
      console.log(`Searching Exa: "${query}"`);

      const exaResponse = await fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "x-api-key": exaApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          numResults: 20,
          category: "news",
          startPublishedDate: startDate,
          contents: { text: true },
        }),
      });

      if (!exaResponse.ok) {
        const errorText = await exaResponse.text();
        console.error(`Exa API error for "${query}":`, errorText);
        continue;
      }

      const exaData = await exaResponse.json();
      const results = exaData.results || [];
      console.log(`Got ${results.length} results for "${query}"`);

      for (const result of results) {
        const url = result.url || "";
        const title = result.title || "";
        const text = result.text || "";
        const publishedDate = result.publishedDate || new Date().toISOString().split("T")[0];
        const source = url ? new URL(url).hostname.replace("www.", "") : "Desconocida";

        const combinedText = `${title} ${text}`;
        const candidates = extractCandidates(combinedText);
        const parties = extractParties(combinedText);

        // Skip articles that don't mention any known candidates or parties
        if (candidates.length === 0 && parties.length === 0) {
          totalSkipped++;
          continue;
        }

        const urlHash = hashUrl(url || title + publishedDate);

        const { error } = await supabase
          .from("noticias_historial")
          .upsert(
            {
              title,
              content: text.substring(0, 5000), // Limit content size
              date: publishedDate.split("T")[0],
              source,
              candidates,
              political_parties: parties,
              url_hash: urlHash,
            },
            { onConflict: "url_hash" }
          );

        if (error) {
          console.error(`Insert error for "${title}":`, error.message);
        } else {
          totalInserted++;
        }
      }
    }

    const responseBody = {
      success: true,
      inserted: totalInserted,
      skipped: totalSkipped,
      startDate,
      timestamp: new Date().toISOString(),
    };

    console.log("Done:", responseBody);

    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in fetch-news:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error desconocido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
