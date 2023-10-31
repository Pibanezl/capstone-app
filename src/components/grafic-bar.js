import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import 'recharts'
function GraficoDeBarras({ datosPorNivel }) {
  // Asegúrate de que datosPorNivel sea un objeto válido
  if (!datosPorNivel || typeof datosPorNivel !== 'object') {
    return <div>Datos no válidos</div>;
  }

  // Total de incidencias
  const totalIncidencias = Object.values(datosPorNivel).reduce((acc, count) => acc + count, 0);

  // Calcula los porcentajes por nivel
  const porcentajesPorNivel = [];
  for (const nivel in datosPorNivel) {
    const cantidad = datosPorNivel[nivel];
    const porcentaje = ((cantidad / totalIncidencias) * 100).toFixed(2);
    porcentajesPorNivel.push({ nivel, porcentaje });
  }

  const datosRadar = Object.keys(datosPorNivel).map((nivel) => ({
    nivel,
    porcentaje: ((datosPorNivel[nivel] / totalIncidencias) * 100).toFixed(2),
  }));


  return (
    <div className="Container-grafico-barras">
      <div className="Container-grafico-barras-left">
      <h2 className="title-grafico-barras">Gráfico de Barras: Porcentaje de Incidencias por Nivel</h2>
      <BarChart width={600} height={400} data={porcentajesPorNivel}>
        <XAxis dataKey="nivel" stroke="white"/>
        <YAxis stroke="white"/>
        <Tooltip labelStyle={{ color: 'black' }} itemStyle={{ color: 'red' }} />
        <Legend  height={36}/>
        <Bar dataKey="porcentaje" name="Porcentaje" fill="rgba(75, 192, 192, 0.2)" />
      </BarChart>
      </div>
      <div className="Container-grafico-barras-rigth">
       <h2>Gráfico de Radar: Porcentaje de Incidencias por Nivel</h2>
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={datosRadar}>
        <PolarGrid />
        <PolarAngleAxis dataKey="nivel" />
        <PolarRadiusAxis />
        <Radar name="Porcentaje" dataKey="porcentaje" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
      </div>
    </div>
  );
}

export default GraficoDeBarras;
