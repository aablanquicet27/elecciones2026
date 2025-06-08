import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Configuración estética para los gráficos
plt.style.use('ggplot')
sns.set_palette("Set2")
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.size'] = 10
plt.rcParams['axes.titlesize'] = 16
plt.rcParams['axes.labelsize'] = 12

# Creamos un DataFrame con la intención de voto según las encuestas más recientes
# Basado en los datos de las encuestas Guarumo/EcoAnalítica de abril 2025
candidatos_data = {
    'Candidato': [
        'Gustavo Bolívar', 'Sergio Fajardo', 'Vicky Dávila', 'Germán Vargas Lleras', 
        'Claudia López', 'María Fernanda Cabal', 'Miguel Uribe', 'Juan Manuel Galán',
        'Daniel Quintero', 'Iván Cepeda', 'María José Pizarro', 'Paloma Valencia',
        'David Luna', 'Alejandro Gaviria', 'Juan Daniel Oviedo', 'Carlos Caicedo',
        'Susana Muhammad', 'Luis Gilberto Murillo', 'Mauricio Lizcano', 'Roy Barreras',
        'Voto en Blanco', 'NS/NR', 'Ninguno'
    ],
    'Porcentaje': [
        12.6, 11.4, 11.6, 5.6, 4.7, 4.6, 4.5, 4.0, 3.8, 3.5, 2.6, 
        1.0, 1.2, 1.0, 1.5, 0.4, 0.3, 0.2, 0.2, 0.3, 
        7.2, 4.2, 5.9
    ],
    'Tendencia': [
        'Izquierda', 'Centro', 'Derecha', 'Derecha', 'Centro', 'Derecha', 'Derecha',
        'Centro', 'Izquierda', 'Izquierda', 'Izquierda', 'Derecha', 'Derecha', 'Centro',
        'Centro', 'Izquierda', 'Izquierda', 'Centro', 'Centro', 'Izquierda',
        'Otros', 'Otros', 'Otros'
    ]
}

df_intencion = pd.DataFrame(candidatos_data)

# Mostrar los candidatos principales (top 10) de acuerdo a la intención de voto
df_top10 = df_intencion.sort_values('Porcentaje', ascending=False).head(10)
print("Top 10 candidatos según intención de voto:")
print(df_top10)

# Gráfico 1: Intención de voto por candidato (top 10)
plt.figure(figsize=(14, 8))
bars = plt.bar(df_top10['Candidato'], df_top10['Porcentaje'], color=sns.color_palette("Set2", 10))

# Añadir los valores en las barras
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 0.1,
             f'{height}%', ha='center', va='bottom', fontweight='bold')

plt.title('Intención de voto presidencial Colombia 2026 - Top 10 candidatos', fontweight='bold')
plt.xlabel('Candidatos')
plt.ylabel('Porcentaje (%)')
plt.xticks(rotation=45, ha='right')
plt.ylim(0, 15)  # Ajustar límite vertical
plt.tight_layout()
plt.savefig('intencion_voto_2026.png', dpi=300, bbox_inches='tight')
plt.close()

# Gráfico 2: Intención de voto por tendencia política
df_tendencia = df_intencion.groupby('Tendencia')['Porcentaje'].sum().reset_index()
df_tendencia = df_tendencia[df_tendencia['Tendencia'] != 'Otros']  # Excluir "Otros" para el análisis por tendencia

colores_tendencia = {'Izquierda': '#E41A1C', 'Centro': '#377EB8', 'Derecha': '#4DAF4A'}
plt.figure(figsize=(10, 7))
bars = plt.bar(df_tendencia['Tendencia'], df_tendencia['Porcentaje'], 
               color=[colores_tendencia[t] for t in df_tendencia['Tendencia']])

# Añadir los valores en las barras
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 0.3,
             f'{height:.1f}%', ha='center', va='bottom', fontweight='bold')

plt.title('Intención de voto por tendencia política - Elecciones 2026', fontweight='bold')
plt.xlabel('Tendencia Política')
plt.ylabel('Porcentaje (%)')
plt.ylim(0, 35)
plt.savefig('intencion_voto_tendencia_2026.png', dpi=300, bbox_inches='tight')
plt.close()

print("\nPorcentaje de intención de voto por tendencia política:")
print(df_tendencia)

# Datos de favorabilidad vs. desfavorabilidad para los principales candidatos
# Estos datos son aproximados basados en la información disponible
favorabilidad_data = {
    'Candidato': [
        'Gustavo Bolívar', 'Sergio Fajardo', 'Vicky Dávila', 'Germán Vargas Lleras', 
        'Claudia López', 'María Fernanda Cabal', 'Miguel Uribe', 'Juan Manuel Galán',
        'Daniel Quintero', 'María José Pizarro'
    ],
    'Favorabilidad': [
        34, 42, 38, 29, 31, 27, 32, 40, 23, 29
    ],
    'Desfavorabilidad': [
        48, 32, 44, 54, 45, 56, 40, 28, 58, 41
    ]
}

df_favorabilidad = pd.DataFrame(favorabilidad_data)

# Gráfico 3: Comparación de favorabilidad vs. desfavorabilidad
plt.figure(figsize=(14, 8))
x = range(len(df_favorabilidad['Candidato']))
width = 0.35

plt.bar([i - width/2 for i in x], df_favorabilidad['Favorabilidad'], width, label='Favorabilidad', color='#377EB8')
plt.bar([i + width/2 for i in x], df_favorabilidad['Desfavorabilidad'], width, label='Desfavorabilidad', color='#E41A1C')

plt.title('Favorabilidad vs. Desfavorabilidad - Candidatos presidenciales 2026', fontweight='bold')
plt.ylabel('Porcentaje (%)')
plt.xticks(x, df_favorabilidad['Candidato'], rotation=45, ha='right')
plt.legend()
plt.ylim(0, 70)
plt.tight_layout()
plt.savefig('favorabilidad_vs_desfavorabilidad.png', dpi=300, bbox_inches='tight')
plt.close()

# Datos de seguidores en redes sociales (aproximados)
redes_sociales_data = {
    'Candidato': [
        'Vicky Dávila', 'Claudia López', 'Daniel Quintero', 
        'Gustavo Bolívar', 'María Fernanda Cabal', 'Sergio Fajardo',
        'María José Pizarro', 'Miguel Uribe', 'Juan Daniel Oviedo'
    ],
    'Facebook': [
        920400, 1300000, 350000, 500000, 280000, 780000, 250000, 320000, 150000
    ],
    'Instagram': [
        1300000, 1000000, 352100, 500000, 309900, 300000, 270000, 240000, 239400
    ],
    'Twitter': [
        1400000, 1200000, 800000, 950000, 760000, 830000, 500000, 420000, 340000
    ]
}

df_redes = pd.DataFrame(redes_sociales_data)

# Gráfico 4: Presencia en redes sociales
plt.figure(figsize=(14, 8))
bar_width = 0.25
x = np.arange(len(df_redes['Candidato']))

plt.bar(x - bar_width, df_redes['Facebook'], bar_width, label='Facebook')
plt.bar(x, df_redes['Instagram'], bar_width, label='Instagram')
plt.bar(x + bar_width, df_redes['Twitter'], bar_width, label='Twitter')

plt.title('Seguidores en redes sociales - Candidatos presidenciales 2026', fontweight='bold')
plt.ylabel('Número de seguidores')
plt.xticks(x, df_redes['Candidato'], rotation=45, ha='right')
plt.legend()
plt.tight_layout()
plt.savefig('seguidores_redes_sociales.png', dpi=300, bbox_inches='tight')
plt.close()

# Análisis por regiones (datos aproximados)
regiones_data = {
    'Region': ['Caribe', 'Andina', 'Pacífica', 'Orinoquía', 'Amazonía'],
    'Bolívar': [25.9, 10.2, 15.8, 5.4, 8.7],
    'Fajardo': [20.1, 12.8, 14.3, 8.2, 9.5],
    'Dávila': [8.4, 12.5, 9.6, 15.7, 11.2],
    'Cabal': [6.2, 8.4, 4.1, 12.3, 9.8],
    'Vargas': [7.5, 6.2, 4.5, 8.9, 5.6],
    'Otros': [31.9, 49.9, 51.7, 49.5, 55.2]
}

df_regiones = pd.DataFrame(regiones_data)

# Convertir los datos para visualización
df_regiones_melt = pd.melt(df_regiones, id_vars=['Region'], var_name='Candidato', value_name='Porcentaje')

# Gráfico 5: Intención de voto por regiones
plt.figure(figsize=(14, 10))
sns.barplot(x='Region', y='Porcentaje', hue='Candidato', data=df_regiones_melt)
plt.title('Intención de voto por regiones - Elecciones 2026', fontweight='bold')
plt.xlabel('Región')
plt.ylabel('Porcentaje (%)')
plt.legend(title='Candidato')
plt.tight_layout()
plt.savefig('intencion_voto_regiones.png', dpi=300, bbox_inches='tight')
plt.close()

# Análisis demográfico por edad (datos aproximados)
edades_data = {
    'Grupo_Edad': ['18-24', '25-34', '35-44', '45-54', '55+'],
    'Bolívar': [18.5, 15.2, 11.7, 8.6, 7.3],
    'Fajardo': [10.2, 11.5, 12.4, 11.8, 10.9],
    'Dávila': [8.1, 9.5, 12.8, 13.5, 14.2],
    'Cabal': [3.5, 4.2, 5.1, 6.2, 7.4],
    'Vargas': [2.8, 4.1, 5.6, 7.3, 8.2],
    'Otros': [56.9, 55.5, 52.4, 52.6, 52.0]
}

df_edades = pd.DataFrame(edades_data)

# Convertir los datos para visualización
df_edades_melt = pd.melt(df_edades, id_vars=['Grupo_Edad'], var_name='Candidato', value_name='Porcentaje')

# Gráfico 6: Intención de voto por grupos de edad
plt.figure(figsize=(14, 10))
sns.barplot(x='Grupo_Edad', y='Porcentaje', hue='Candidato', data=df_edades_melt)
plt.title('Intención de voto por grupos de edad - Elecciones 2026', fontweight='bold')
plt.xlabel('Grupo de edad')
plt.ylabel('Porcentaje (%)')
plt.legend(title='Candidato')
plt.tight_layout()
plt.savefig('intencion_voto_edad.png', dpi=300, bbox_inches='tight')
plt.close()

# Comparación con elecciones 2022 (datos de primera vuelta)
comparacion_data = {
    'Tendencia': ['Izquierda', 'Centro', 'Derecha', 'Otros'],
    '2022': [40.3, 28.2, 28.5, 3.0],
    '2026_proyeccion': [23.0, 27.0, 29.0, 21.0]
}

df_comparacion = pd.DataFrame(comparacion_data)

# Gráfico 7: Comparación de tendencias políticas 2022 vs. 2026
plt.figure(figsize=(12, 8))
x = range(len(df_comparacion['Tendencia']))
width = 0.35

plt.bar([i - width/2 for i in x], df_comparacion['2022'], width, label='2022', color='#377EB8')
plt.bar([i + width/2 for i in x], df_comparacion['2026_proyeccion'], width, label='2026 (proyección)', color='#4DAF4A')

plt.title('Comparación de tendencias políticas: Elecciones 2022 vs. 2026 (proyección)', fontweight='bold')
plt.ylabel('Porcentaje (%)')
plt.xticks(x, df_comparacion['Tendencia'])
plt.legend()
plt.ylim(0, 45)
plt.tight_layout()
plt.savefig('comparacion_2022_2026.png', dpi=300, bbox_inches='tight')
plt.close()

print("\nComparación de tendencias políticas 2022 vs 2026 (proyección):")
print(df_comparacion)

# Escenarios de segunda vuelta (datos hipotéticos)
segunda_vuelta_data = {
    'Escenario': [
        'Bolívar vs. Dávila', 
        'Bolívar vs. Fajardo', 
        'Fajardo vs. Dávila',
        'Dávila vs. Vargas',
        'Bolívar vs. Cabal'
    ],
    'Candidato1': ['Bolívar', 'Bolívar', 'Fajardo', 'Dávila', 'Bolívar'],
    'Porcentaje1': [43.5, 41.2, 38.6, 37.4, 42.3],
    'Candidato2': ['Dávila', 'Fajardo', 'Dávila', 'Vargas', 'Cabal'],
    'Porcentaje2': [46.8, 48.5, 35.2, 32.6, 44.7],
    'Indecisos': [9.7, 10.3, 26.2, 30.0, 13.0]
}

df_segunda_vuelta = pd.DataFrame(segunda_vuelta_data)

# Gráfico 8: Escenarios de segunda vuelta
plt.figure(figsize=(14, 10))

for i, escenario in enumerate(df_segunda_vuelta['Escenario']):
    plt.subplot(3, 2, i+1)
    
    # Valores a graficar
    valores = [
        df_segunda_vuelta.loc[i, 'Porcentaje1'],
        df_segunda_vuelta.loc[i, 'Porcentaje2'],
        df_segunda_vuelta.loc[i, 'Indecisos']
    ]
    
    # Etiquetas
    etiquetas = [
        f"{df_segunda_vuelta.loc[i, 'Candidato1']} ({valores[0]}%)",
        f"{df_segunda_vuelta.loc[i, 'Candidato2']} ({valores[1]}%)",
        f"Indecisos ({valores[2]}%)"
    ]
    
    # Colores
    colores = ['#E41A1C', '#377EB8', '#CCCCCC']
    
    plt.pie(valores, labels=etiquetas, colors=colores, autopct='%1.1f%%', startangle=90)
    plt.title(escenario)
    plt.axis('equal')

plt.tight_layout()
plt.suptitle('Escenarios de segunda vuelta - Elecciones 2026', fontsize=16, fontweight='bold', y=1.02)
plt.savefig('escenarios_segunda_vuelta.png', dpi=300, bbox_inches='tight')
plt.close()

# Guardar los datos para un posible uso posterior
df_intencion.to_csv('intencion_voto_2026.csv', index=False)
df_favorabilidad.to_csv('favorabilidad_candidatos_2026.csv', index=False)
df_redes.to_csv('presencia_redes_sociales_2026.csv', index=False)
df_regiones.to_csv('intencion_voto_regiones_2026.csv', index=False)
df_edades.to_csv('intencion_voto_edades_2026.csv', index=False)
df_comparacion.to_csv('comparacion_2022_2026.csv', index=False)
df_segunda_vuelta.to_csv('escenarios_segunda_vuelta_2026.csv', index=False)

print("\nTodos los gráficos y datos han sido guardados correctamente.")