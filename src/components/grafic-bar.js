import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import 'recharts'
import '../styles/sass/graficos.scss'
function GraficoDeBarras({ datosPorNivel, datosComuna, datosMeses, datosCat,rol }) {
  // Asegúrate de que datosPorNivel sea un objeto válido
  let datosRadar
  let porcentajeMaximo
  let datosRadarAjustados
  // Total de incidencias
  const totalIncidencias = Object.values(datosMeses).reduce((acc, count) => acc + count, 0);
  console.log("MESES", datosMeses)
if(rol === "directorgeneral" || rol === "directorescuela"){
  datosRadar = Object.keys(datosPorNivel).map((nivel) => ({
    nivel,
    porcentaje: ((datosPorNivel[nivel] / totalIncidencias) * 100).toFixed(2),
  }));

  // Calcular el porcentaje máximo
porcentajeMaximo = Math.max(...datosRadar.map(item => parseFloat(item.porcentaje)));

// Ajustar los porcentajes para que el tope sea 100%
datosRadarAjustados = datosRadar.map(item => ({
    nivel: item.nivel,
    porcentaje: (item.porcentaje / porcentajeMaximo) * 100,
}));
}
  const monthOrder = {
    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
    'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12,
  };
  const sortedDataMeses = Object.entries(datosMeses)
    .sort((a, b) => monthOrder[a[0]] - monthOrder[b[0]])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  // Calcula los porcentajes por nivel
  const porcentajesPorNivel = [];
  for (const nivel in sortedDataMeses) {
    const cantidad = sortedDataMeses[nivel];
    const porcentaje = ((cantidad / totalIncidencias) * 100).toFixed(2);
    porcentajesPorNivel.push({ nivel, porcentaje });
  }
  
  
  // Encontrar el elemento con el mayor número de incidencias
  const maxCountElement = datosComuna.reduce((max, current) => (current.count > max.count ? current : max), datosComuna[0]);

  // Encontrar el elemento con el menor número de incidencias
  const minCountElement = datosComuna.reduce((min, current) => (current.count < min.count ? current : min), datosComuna[0]);
  // Ordenar el array de objetos de mayor a menor count
  const sortedData = datosComuna.sort((a, b) => b.count - a.count);

  const CustomTooltip = ({ active, payload }) => {
    if (active) {
      return (
        <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
          <p>{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  console.log("ROOOL GRAFIC",rol)
  if(rol === "directorgeneral"){
    return (
      <div className="Container-grafico-barras">
        <div className="Container-graficos-redondos">
        <div className="Container-grafico-barras-rigth">
          <h2 className="title-grafico-barras">Gráfico de Radar: Porcentaje de Incidencias por Nivel</h2>
          <RadarChart cx={230} cy={150} outerRadius={120} width={600} height={500} data={datosRadarAjustados}>
            <PolarGrid />
            <PolarAngleAxis dataKey="nivel" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis />
            <Radar name="Porcentaje" dataKey="porcentaje" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </div>
        <div className="Container-grafico-torta">
          <h2 className="title-grafico-barras">Gráfico de Torta: Numero de Incidencias por Categoria</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={datosCat}
              dataKey="population"
              nameKey="name"
              cx="60%"
              cy="40%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {
                datosCat.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))
              }
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </div>
        </div>
        
        <div className="Container-grafico-barras-meses">
          <h2 className="title-grafico-barras">Gráfico de Barras: Porcentaje de Incidencias por Meses</h2>
          <BarChart width={600} height={400} data={porcentajesPorNivel}>
            <XAxis dataKey="nivel" stroke="white" />
            <YAxis stroke="white" domain={[0, 100]} />
            <Tooltip labelStyle={{ color: 'black' }} itemStyle={{ color: 'red' }} />
            <Legend height={36} />
            <Bar dataKey="porcentaje" name="Porcentaje" fill="rgba(75, 192, 192, 0.2)" />
          </BarChart>
        </div>
        <div className="Container-datos-comunas-general">
          <h1 className="title-comunas">Datos incidencias por comunas</h1>
          <div className="Container-datos-comunas">
            <div className="Container-comunas">
              <div className="Container-incidencias-lista-comuna">
                {sortedData.map((incidencia, index) => (
                  <li className="Container-incidencias-li-comunas" key={index}>
                    <div className="Container-left-comunas">
                      <h2 className="nombre-comuna">Comuna: {incidencia.name}</h2>
                      <p className="cantidad-comuna">Cantidad: {incidencia.count}</p>
                    </div>
                  </li>
                ))}
              </div>
            </div>
            <div className="Container-incidencias-datos-comuna">
              <div className="Container-comuna-max">
                <h3 className="title-comuna-dato">Comuna con mayor registro de incidencias: {maxCountElement?.name}</h3>
                <p className="comuna-max-cant">{maxCountElement?.count}</p>
              </div>
              <div className="Container-comuna-min">
                <h3 className="title-comuna-dato">Comuna con menor registro de incidencias: {minCountElement?.name}</h3>
                <p className="comuna-min-cant">{minCountElement?.count}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if(rol === "directorescuela"){
    return (
      <div className="Container-grafico-barras">
        <div className="Container-graficos-redondos">
        <div className="Container-grafico-barras-rigth">
          <h2 className="title-grafico-barras">Gráfico de Radar: Porcentaje de Incidencias por Nivel</h2>
          <RadarChart cx={230} cy={150} outerRadius={120} width={600} height={500} data={datosRadarAjustados}>
            <PolarGrid />
            <PolarAngleAxis dataKey="nivel" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis />
            <Radar name="Porcentaje" dataKey="porcentaje" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </div>
        <div className="Container-grafico-torta">
          <h2 className="title-grafico-barras">Gráfico de Torta: Numero de Incidencias por Categoria</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={datosCat}
              dataKey="population"
              nameKey="name"
              cx="60%"
              cy="40%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {
                datosCat.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))
              }
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </div>
        </div>
        
        <div className="Container-grafico-barras-meses">
          <h2 className="title-grafico-barras">Gráfico de Barras: Porcentaje de Incidencias por Meses</h2>
          <BarChart width={600} height={400} data={porcentajesPorNivel}>
            <XAxis dataKey="nivel" stroke="white" />
            <YAxis stroke="white" domain={[0, 100]} />
            <Tooltip labelStyle={{ color: 'black' }} itemStyle={{ color: 'red' }} />
            <Legend height={36} />
            <Bar dataKey="porcentaje" name="Porcentaje" fill="rgba(75, 192, 192, 0.2)" barSize={30} />
          </BarChart>
        </div>
      </div>
    );
  } else if(rol === "directorcomunidad"){
    return (
      <div className="Container-grafico-barras">
        <div className="Container-graficos-redondos">
        <div className="Container-grafico-torta">
          <h2 className="title-grafico-barras">Gráfico de Torta: Numero de Incidencias por Categoria</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={datosCat}
              dataKey="population"
              nameKey="name"
              cx="60%"
              cy="40%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {
                datosCat.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))
              }
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </div>
        </div>
        
        <div className="Container-grafico-barras-meses">
          <h2 className="title-grafico-barras">Gráfico de Barras: Porcentaje de Incidencias por Meses</h2>
          <BarChart width={600} height={400} data={porcentajesPorNivel}>
            <XAxis dataKey="nivel" stroke="white" />
            <YAxis stroke="white" domain={[0, 100]} />
            <Tooltip labelStyle={{ color: 'black' }} itemStyle={{ color: 'red' }} />
            <Legend height={36} />
            <Bar dataKey="porcentaje" name="Porcentaje" fill="rgba(75, 192, 192, 0.2)" />
          </BarChart>
        </div>
        <div className="Container-datos-comunas-general">
          <h1 className="title-comunas">Datos incidencias por comunas</h1>
          <div className="Container-datos-comunas">
            <div className="Container-comunas">
              <div className="Container-incidencias-lista-comuna">
                {sortedData.map((incidencia, index) => (
                  <li className="Container-incidencias-li-comunas" key={index}>
                    <div className="Container-left-comunas">
                      <h2 className="nombre-comuna">Comuna: {incidencia.name}</h2>
                      <p className="cantidad-comuna">Cantidad: {incidencia.count}</p>
                    </div>
                  </li>
                ))}
              </div>
            </div>
            <div className="Container-incidencias-datos-comuna">
              <div className="Container-comuna-max">
                <h3 className="title-comuna-dato">Comuna con mayor registro de incidencias: {maxCountElement?.name}</h3>
                <p className="comuna-max-cant">{maxCountElement?.count}</p>
              </div>
              <div className="Container-comuna-min">
                <h3 className="title-comuna-dato">Comuna con menor registro de incidencias: {minCountElement?.name}</h3>
                <p className="comuna-min-cant">{minCountElement?.count}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

export default GraficoDeBarras;
