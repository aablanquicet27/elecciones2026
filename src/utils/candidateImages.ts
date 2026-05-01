export const getCandidateImage = (name: string, size: number = 400): string => {
  // Normalize the name: accent-insensitive and case-insensitive
  const key = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Caso especial: Voto en Blanco (no es candidato real)
  if (key === 'voto en blanco') {
    return `https://ui-avatars.com/api/?name=Voto+Blanco&size=${size}&background=e5e7eb&color=374151&bold=true&format=png`;
  }

  // Map of normalised candidate names to their file names inside the public folder
  const images: Record<string, string> = {
    'ivan cepeda': 'Ivan_Cepeda.jpg',
    'abelardo de la espriella': 'Abelardo_Espriella.jpg',
    'juan daniel oviedo': 'Juan_Daniel_Oviedo.jpg',
    'jota pe hernandez': 'Jota_Pe_Hernandez.jpg',
    'maria jose pizarro': 'Maria_Jose_Pizarro.jpg',
    'daniel quintero': 'Daniel_Quintero.jpg',
    'juan manuel galan': 'Juan_Manuel_Galan.jpg',
    'miguel uribe turbay': 'Miguel_Uribe_Turbay.jpg',
    'maria fernanda cabal': 'Maria_Fernanda_Cabal.jpg',
    'claudia lopez': 'Claudia_Lopez.png',
    'german vargas lleras': 'German_Vargas_Lleras.jpg',
    'sergio fajardo': 'Sergio_Fajardo.jpg',
    'vicky davila': 'Vicky_Davila.jpg',
    'gustavo bolivar': 'Gustavo_Bolivar.jpg',
    'paloma valencia': 'Paloma_Valencia.jpg',
    'francia marquez': 'Francia_Marquez.jpg',
    'alejandro gaviria': 'Alejandro_Gaviria.jpg',
    'david luna': 'David_Luna.jpg',
    'susana muhamad': 'Susana_Muhamad.jpg',
    'camilo romero': 'Camilo_Romero.jpg'
  };

  const fileName = images[key];
  if (fileName) {
    return `/Colombian Political Figures Favorability Ratings (1)/${fileName}`;
  }

  // Fallback: avatar con iniciales (color morado de marca)
  const safeName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${safeName}&size=${size}&background=7c3aed&color=ffffff&bold=true&format=png`;
};
