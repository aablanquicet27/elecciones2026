/**
 * Obtiene y procesa las noticias desde el servidor de Render.
 * Esta única función se encarga de:
 * 1. Conectarse a la URL.
 * 2. Obtener el JSON.
 * 3. Validar los artículos usando el schema que viene en la misma respuesta.
 * 4. Devolver un objeto con los datos listos o un error.
 *
 * @returns {Promise<object>} Una promesa que resuelve a un objeto con:
 * - exito (boolean): true si todo fue correcto.
 * - datos (Array): La lista de artículos validados.
 * - error (string|null): Un mensaje de error si algo falló.
 */
export async function obtenerNoticiasProcesadas() {
  const url = 'https://elecciones202.onrender.com/daily-news';

  try {
    // --- PASO 1: CONECTAR Y OBTENER EL JSON ---
    const respuestaServidor = await fetch(url);
    if (!respuestaServidor.ok) {
      throw new Error(`Error de red del servidor: ${respuestaServidor.status}`);
    }
    const jsonCompleto = await respuestaServidor.json();

    // --- PASO 2: PROCESAR EL JSON Y VALIDAR CON EL SCHEMA ---
    if (!jsonCompleto || !jsonCompleto.success || !jsonCompleto.data?.data?.articles) {
      throw new Error("La respuesta de la API es inválida o no contiene la estructura esperada.");
    }

    const articulosCrudos = jsonCompleto.data.data.articles;
    const schema = jsonCompleto.data.schema;
    const camposRequeridos = schema?.properties?.articles?.items?.required;

    if (!camposRequeridos) {
      console.warn("No se encontró un schema para validar. Se devolverán los datos sin filtrar.");
      return { exito: true, datos: articulosCrudos, error: null };
    }
    
    const articulosValidados = articulosCrudos.filter(articulo => {
      // Valida que cada artículo tenga todos los campos requeridos por el schema.
      return camposRequeridos.every(campo => articulo.hasOwnProperty(campo));
    });

    // --- PASO 3: DEVOLVER EL RESULTADO FINAL ---
    return {
      exito: true,
      datos: articulosValidados,
      error: null
    };

  } catch (err) {
    // --- MANEJO DE CUALQUIER ERROR ---
    console.error("Falló el proceso de obtención de noticias:", err);
    return {
      exito: false,
      datos: [],
      error: err.message
    };
  }
}
