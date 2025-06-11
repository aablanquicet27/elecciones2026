import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os
import subprocess
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Configuración estética para los gráficos
plt.style.use('ggplot')
sns.set_palette("Set2")
plt.rcParams['figure.figsize'] = (14, 10)
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.size'] = 10
plt.rcParams['axes.titlesize'] = 16
plt.rcParams['axes.labelsize'] = 12

def run_scraper():
    """Ejecuta el scraper de Node.js para obtener datos actualizados"""
    try:
        print("🔄 Ejecutando scraper para obtener datos actualizados...")
        result = subprocess.run(['node', 'scripts/scraper.js'], 
                              capture_output=True, text=True, cwd='.')
        
        if result.returncode == 0:
            print("✅ Scraper ejecutado exitosamente")
            return True
        else:
            print(f"⚠️ Error en scraper: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error ejecutando scraper: {e}")
        return False

def load_real_time_data():
    """Carga los datos en tiempo real desde el archivo JSON"""
    data_file = 'scripts/real_time_data.json'
    
    if not os.path.exists(data_file):
        print("📡 No se encontraron datos previos, ejecutando scraper...")
        if not run_scraper():
            print("❌ No se pudieron obtener datos actualizados")
            return None
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"📊 Datos cargados exitosamente")
        print(f"🕐 Última actualización: {data.get('last_updated', 'No disponible')}")
        print(f"📋 Fuente: {data.get('source', 'No disponible')}")
        
        return data
    except Exception as e:
        print(f"❌ Error cargando datos: {e}")
        return None

def process_polling_data(data):
    """Procesa los datos de encuestas y los convierte a DataFrames"""
    if not data or 'voting_intention' not in data:
        return None, None
    
    # Obtener la encuesta más reciente
    latest_poll = data['voting_intention'][0]
    
    # Crear DataFrame con los candidatos y sus porcentajes
    candidates_data = []
    for candidate in latest_poll['candidates']:
        # Limpiar el porcentaje (remover % y convertir a float)
        percentage = float(candidate['percentage'].replace('%', ''))
        candidates_data.append({
            'Candidato': candidate['name'],
            'Porcentaje': percentage,
            'Tendencia': classify_political_tendency(candidate['name'])
        })
    
    df_latest = pd.DataFrame(candidates_data)
    
    # Crear DataFrame histórico con todas las encuestas
    historical_data = []
    for poll in data['voting_intention']:
        for candidate in poll['candidates']:
            percentage = float(candidate['percentage'].replace('%', ''))
            historical_data.append({
                'Fecha': poll['date'],
                'Encuestadora': poll['pollster'],
                'Candidato': candidate['name'],
                'Porcentaje': percentage,
                'Muestra': poll['sample_size'],
                'Margen_Error': poll['error_margin']
            })
    
    df_historical = pd.DataFrame(historical_data)
    
    return df_latest, df_historical

def classify_political_tendency(candidate_name):
    """Clasifica la tendencia política de cada candidato"""
    # Diccionario de tendencias políticas (actualizado con los nuevos candidatos)
    tendencias = {
        'Gustavo Bolívar': 'Izquierda',
        'Vicky Dávila': 'Derecha',
        'Sergio Fajardo': 'Centro',
        'Claudia López': 'Centro',
        'Alejandro Gaviria': 'Centro',
        'Francia Márquez': 'Izquierda',
        'Germán Vargas': 'Derecha',
        'Daniel Quintero': 'Izquierda',
        'María José Pizarro': 'Izquierda',
        'David Luna': 'Derecha',
        'Carlos Caicedo': 'Izquierda',
        'Luis Gilberto Murillo': 'Centro',
        'Paloma Valencia': 'Derecha',
        'Miguel Uribe': 'Derecha',
        'María Fernanda Cabal': 'Derecha',
        'Enrique Peñalosa': 'Centro',
        'Juan Manuel Galán': 'Centro',
        'Santiago Botero': 'Centro',
        'Camilo Romero': 'Centro',
        'Iván Cepeda': 'Izquierda',
        'Susana Muhamad': 'Izquierda',
        'Luis Fernando Velasco': 'Centro',
        'Ninguno': 'Otros'
    }
    
    return tendencias.get(candidate_name, 'Centro')

def create_visualizations(df_latest, df_historical, data):
    """Crea todas las visualizaciones con datos en tiempo real"""
    
    # Información de la encuesta más reciente
    latest_poll = data['voting_intention'][0]
    
    # 1. Gráfico principal: Top 10 candidatos (encuesta más reciente)
    df_top10 = df_latest.sort_values('Porcentaje', ascending=False).head(10)
    
    plt.figure(figsize=(16, 10))
    colors = sns.color_palette("Set2", 10)
    bars = plt.bar(range(len(df_top10)), df_top10['Porcentaje'], color=colors)
    
    # Añadir los valores en las barras
    for i, (bar, pct) in enumerate(zip(bars, df_top10['Porcentaje'])):
        plt.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.2,
                f'{pct}%', ha='center', va='bottom', fontweight='bold', fontsize=11)
    
    plt.title(f'Intención de Voto - Colombia 2026\n{latest_poll["pollster"]} ({latest_poll["date"]}) - Muestra: {latest_poll["sample_size"]} personas', 
              fontweight='bold', fontsize=18, pad=20)
    plt.ylabel('Porcentaje (%)', fontsize=14)
    plt.xticks(range(len(df_top10)), df_top10['Candidato'], rotation=45, ha='right', fontsize=12)
    plt.ylim(0, max(df_top10['Porcentaje']) * 1.2)
    plt.grid(axis='y', alpha=0.3)
    
    # Añadir información adicional
    plt.figtext(0.02, 0.02, f'Última actualización: {data.get("last_updated", "N/A")[:19]} | Margen de error: {latest_poll["error_margin"]}', 
                fontsize=10, style='italic')
    
    plt.tight_layout()
    plt.savefig('visualizations/intencion_voto_real_2026.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # 2. Gráfico por tendencias políticas
    df_tendencia = df_latest.groupby('Tendencia')['Porcentaje'].sum().reset_index()
    df_tendencia = df_tendencia[df_tendencia['Tendencia'] != 'Otros']
    
    colores_tendencia = {'Izquierda': '#E41A1C', 'Centro': '#377EB8', 'Derecha': '#4DAF4A'}
    
    plt.figure(figsize=(12, 8))
    bars = plt.bar(df_tendencia['Tendencia'], df_tendencia['Porcentaje'], 
                   color=[colores_tendencia.get(t, '#CCCCCC') for t in df_tendencia['Tendencia']])
    
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                f'{height:.1f}%', ha='center', va='bottom', fontweight='bold', fontsize=12)
    
    plt.title(f'Intención de Voto por Tendencia Política\n{latest_poll["pollster"]} ({latest_poll["date"]})', 
              fontweight='bold', fontsize=16)
    plt.xlabel('Tendencia Política', fontsize=14)
    plt.ylabel('Porcentaje (%)', fontsize=14)
    plt.ylim(0, max(df_tendencia['Porcentaje']) * 1.2)
    plt.grid(axis='y', alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('visualizations/tendencias_politicas_real_2026.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # 3. Evolución histórica (si hay múltiples encuestas)
    if len(data['voting_intention']) > 1:
        # Seleccionar top 6 candidatos de la encuesta más reciente
        top_candidates = df_latest.sort_values('Porcentaje', ascending=False).head(6)['Candidato'].tolist()
        
        plt.figure(figsize=(14, 8))
        
        for candidate in top_candidates:
            candidate_data = df_historical[df_historical['Candidato'] == candidate].copy()
            if not candidate_data.empty:
                candidate_data['Fecha'] = pd.to_datetime(candidate_data['Fecha'])
                candidate_data = candidate_data.sort_values('Fecha')
                plt.plot(candidate_data['Fecha'], candidate_data['Porcentaje'], 
                        marker='o', linewidth=2, label=candidate, markersize=6)
        
        plt.title('Evolución Histórica - Top 6 Candidatos', fontweight='bold', fontsize=16)
        plt.xlabel('Fecha', fontsize=14)
        plt.ylabel('Porcentaje (%)', fontsize=14)
        plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        
        plt.tight_layout()
        plt.savefig('visualizations/evolucion_historica_real_2026.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    # 4. Comparación entre encuestadoras (si hay múltiples)
    if len(df_historical['Encuestadora'].unique()) > 1:
        top_5_candidates = df_latest.sort_values('Porcentaje', ascending=False).head(5)['Candidato'].tolist()
        
        fig, axes = plt.subplots(2, 3, figsize=(18, 12))
        axes = axes.flatten()
        
        for i, candidate in enumerate(top_5_candidates):
            if i < 6:  # Solo mostrar los primeros 5
                candidate_data = df_historical[df_historical['Candidato'] == candidate]
                
                if not candidate_data.empty:
                    sns.barplot(data=candidate_data, x='Encuestadora', y='Porcentaje', ax=axes[i])
                    axes[i].set_title(f'{candidate}', fontweight='bold')
                    axes[i].tick_params(axis='x', rotation=45)
                    axes[i].set_ylim(0, max(candidate_data['Porcentaje']) * 1.2)
        
        # Ocultar subplot adicional si no se usa
        if len(top_5_candidates) < 6:
            axes[5].set_visible(False)
        
        plt.suptitle('Comparación entre Encuestadoras - Top 5 Candidatos', fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.savefig('visualizations/comparacion_encuestadoras_real_2026.png', dpi=300, bbox_inches='tight')
        plt.close()

def generate_summary_report(df_latest, df_historical, data):
    """Genera un reporte resumen de los datos actuales"""
    latest_poll = data['voting_intention'][0]
    
    print("\n" + "="*60)
    print("📊 REPORTE DE INTENCIÓN DE VOTO - COLOMBIA 2026")
    print("="*60)
    
    print(f"\n🗳️  ENCUESTA MÁS RECIENTE:")
    print(f"   📅 Fecha: {latest_poll['date']}")
    print(f"   🏢 Encuestadora: {latest_poll['pollster']}")
    print(f"   👥 Muestra: {latest_poll['sample_size']:,} personas")
    print(f"   📊 Margen de error: {latest_poll['error_margin']}")
    
    print(f"\n🏆 TOP 10 CANDIDATOS:")
    top_10 = df_latest.sort_values('Porcentaje', ascending=False).head(10)
    for i, (_, candidate) in enumerate(top_10.iterrows(), 1):
        print(f"   {i:2d}. {candidate['Candidato']:<25} {candidate['Porcentaje']:5.1f}% ({candidate['Tendencia']})")
    
    print(f"\n🎯 POR TENDENCIA POLÍTICA:")
    tendencias = df_latest.groupby('Tendencia')['Porcentaje'].sum().sort_values(ascending=False)
    for tendencia, porcentaje in tendencias.items():
        if tendencia != 'Otros':
            print(f"   {tendencia:<10} {porcentaje:5.1f}%")
    
    if len(data['voting_intention']) > 1:
        print(f"\n📈 DATOS HISTÓRICOS:")
        print(f"   📊 Total de encuestas: {len(data['voting_intention'])}")
        print(f"   🏢 Encuestadoras: {', '.join(df_historical['Encuestadora'].unique())}")
        
        # Mostrar tendencia del líder
        leader = top_10.iloc[0]['Candidato']
        leader_historical = df_historical[df_historical['Candidato'] == leader].sort_values('Fecha')
        if len(leader_historical) > 1:
            trend = leader_historical['Porcentaje'].iloc[-1] - leader_historical['Porcentaje'].iloc[-2]
            trend_symbol = "📈" if trend > 0 else "📉" if trend < 0 else "➡️"
            print(f"   {trend_symbol} {leader}: {trend:+.1f}% respecto a encuesta anterior")
    
    print(f"\n🕐 Última actualización: {data.get('last_updated', 'N/A')}")
    print("="*60)

def main():
    """Función principal que ejecuta todo el análisis"""
    print("🚀 Iniciando análisis electoral en tiempo real...")
    
    # Crear directorio de visualizaciones si no existe
    os.makedirs('visualizations', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    
    # Ejecutar scraper para datos actualizados
    run_scraper()
    
    # Cargar datos
    data = load_real_time_data()
    if not data:
        print("❌ No se pudieron cargar los datos. Terminando...")
        return
    
    # Procesar datos
    df_latest, df_historical = process_polling_data(data)
    if df_latest is None:
        print("❌ Error procesando los datos. Terminando...")
        return
    
    # Crear visualizaciones
    print("📊 Generando visualizaciones...")
    create_visualizations(df_latest, df_historical, data)
    
    # Generar reporte
    generate_summary_report(df_latest, df_historical, data)
    
    # Guardar datos procesados
    df_latest.to_csv('data/intencion_voto_actual.csv', index=False)
    df_historical.to_csv('data/datos_historicos.csv', index=False)
    
    print("\n✅ Análisis completado exitosamente!")
    print("📁 Visualizaciones guardadas en: ./visualizations/")
    print("📄 Datos guardados en: ./data/")

if __name__ == "__main__":
    main() 