import plotly.graph_objects as go
import plotly.io as pio

# Data for the chart
data = {
    "escenarios": ["Bolívar vs. Dávila", "Bolívar vs. Fajardo", "Fajardo vs. Dávila", "Dávila vs. Vargas", "Bolívar vs. Cabal"],
    "candidato1_nombre": ["Bolívar", "Bolívar", "Fajardo", "Dávila", "Bolívar"],
    "candidato1_porcentaje": [43.5, 41.2, 38.6, 37.4, 42.3],
    "candidato2_nombre": ["Dávila", "Fajardo", "Dávila", "Vargas", "Cabal"],
    "candidato2_porcentaje": [46.8, 48.5, 35.2, 32.6, 44.7]
}

# Shorten scenario names to fit 15 character limit
escenarios_short = ["Bolívar-Dávila", "Bolívar-Fajardo", "Fajardo-Dávila", "Dávila-Vargas", "Bolívar-Cabal"]

# Create the figure
fig = go.Figure()

# Add bars for first candidates
fig.add_trace(go.Bar(
    y=escenarios_short,
    x=data["candidato1_porcentaje"],
    name="Candidato 1",
    orientation='h',
    marker_color='#1FB8CD',
    text=[f'{p}%' for p in data["candidato1_porcentaje"]],
    textposition='inside',
    cliponaxis=False
))

# Add bars for second candidates  
fig.add_trace(go.Bar(
    y=escenarios_short,
    x=data["candidato2_porcentaje"],
    name="Candidato 2", 
    orientation='h',
    marker_color='#FFC185',
    text=[f'{p}%' for p in data["candidato2_porcentaje"]],
    textposition='inside',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Escenarios 2da vuelta - Colombia 2026",
    xaxis_title="Porcentaje (%)",
    yaxis_title="Escenarios",
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image("colombia_segunda_vuelta_2026.png")