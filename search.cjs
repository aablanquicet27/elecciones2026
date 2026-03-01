const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const candidates = [
  { id: 1, name: 'Alexander Flórez', topic: 'maltrato a expareja', media: 'Semana' },
  { id: 2, name: 'Isabel Zuleta', topic: 'capos en tarima', media: 'Infobae' },
  { id: 3, name: 'Julio César González Matador', topic: 'denuncias abuso', media: 'W Radio' },
  { id: 4, name: 'Wadith Manzur', topic: 'UNGRD contratos', media: 'El Tiempo' },
  { id: 5, name: 'Julio Elías Chagüi', topic: 'intermediario UNGRD', media: 'La Silla Vacía' },
  { id: 6, name: 'Martha Peralta', topic: 'contratos UNGRD La Guajira', media: 'Semana' },
  { id: 7, name: 'Jhony Besaile', topic: 'hermano Ñoño Elías', media: 'El Espectador' },
  { id: 8, name: 'David Barguil', topic: 'tráfico influencias DPS', media: 'El Tiempo' },
  { id: 9, name: 'Wilmer Carrillo', topic: 'corrupción infraestructura', media: 'Semana' },
  { id: 10, name: 'José Alfredo Gnecco', topic: 'compra votos clan', media: 'El Tiempo' },
  { id: 11, name: 'Antonio Correa', topic: 'coimas juicio Corte Suprema', media: 'El Espectador' },
  { id: 12, name: 'Richard Aguilar', topic: 'corrupción gobernador Santander', media: 'Semana' },
  { id: 13, name: 'Andrés Calle', topic: 'caso UNGRD', media: 'W Radio' },
  { id: 14, name: 'Yesid Pulgar', topic: 'hermano Eduardo Pulgar', media: 'La Silla Vacía' },
  { id: 15, name: 'César Lorduy', topic: 'caso homicidio 1979', media: 'El Tiempo' },
  { id: 16, name: 'Didier Lobo', topic: 'enriquecimiento', media: 'Infobae' },
  { id: 17, name: 'Berenice Bedoya', topic: 'UNGRD', media: 'La Silla Vacía' },
  { id: 18, name: 'Milena Flórez', topic: 'esposa Musa Besaile', media: 'El Tiempo' },
  { id: 19, name: 'Máximo Noriega', topic: 'caso Nicolás Petro', media: 'Semana' },
  { id: 20, name: 'José Vicente Carreño', topic: 'vínculos paramilitares', media: 'PARES' },
  { id: 21, name: 'Alexánder Angulo', topic: 'UNGRD Pinilla-Olmedo', media: 'W Radio' },
  { id: 22, name: 'Miguel Ángel Barreto', topic: 'Ocad-Paz', media: 'El Tiempo' },
  { id: 23, name: 'Édgar Pote Gómez', topic: 'redes clientelares', media: 'La Silla Vacía' }
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchBing(query) {
  try {
    const response = await axios.get(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const links = [];
    $('.b_algo a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http')) {
        links.push(href);
      }
    });
    return links.length > 0 ? links[0] : null;
  } catch (error) {
    console.error(`Error searching for ${query}: ${error.message}`);
    return null;
  }
}

async function run() {
  const results = [];
  for (const c of candidates) {
    console.log(`Searching for: ${c.name} - ${c.topic}`);
    const query = `${c.name} ${c.topic} ${c.media}`;
    const url = await searchBing(query);
    results.push({ ...c, source_url: url });
    await sleep(2000); // polite delay
  }
  fs.writeFileSync('urls.json', JSON.stringify(results, null, 2));
  console.log('Done.');
}

run();
