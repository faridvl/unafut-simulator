"use client";
import { useState, useMemo } from 'react';

export function useSimulator(initialTeams, matches) {
  // Estado para las predicciones del usuario: { [matchId]: 'home' | 'away' | 'draw' }
  const [predictions, setPredictions] = useState({});

  // 1. CÁLCULO DE LA TABLA EN TIEMPO REAL
  const standings = useMemo(() => {
    // Clonamos equipos y reseteamos contadores para el cálculo dinámico
    let newStandings = initialTeams.map(t => ({ 
      ...t, 
      played: t.played || 0,
      wins: t.wins || 0,
      draws: t.draws || 0,
      losses: t.losses || 0,
      points: t.points || 0,
      gd: t.gd || 0
    }));

    // Aplicamos los resultados que el usuario ha marcado en el simulador
    matches.forEach(match => {
      const result = predictions[match.id];
      if (!result) return; // Si no hay predicción, no se suma nada

      const home = newStandings.find(t => t.id === match.homeId);
      const away = newStandings.find(t => t.id === match.awayId);

      home.played += 1;
      away.played += 1;

      if (result === 'home') {
        home.points += 3;
        home.wins += 1;
        away.losses += 1;
        // Simulamos un cambio de GD estándar (+1 / -1) para visualización
        home.gd += 1;
        away.gd -= 1;
      } else if (result === 'away') {
        away.points += 3;
        away.wins += 1;
        home.losses += 1;
        away.gd += 1;
        home.gd -= 1;
      } else if (result === 'draw') {
        home.points += 1;
        home.draws += 1;
        away.points += 1;
        away.draws += 1;
      }
    });

    // Ordenamiento oficial UNAFUT: 1. Puntos, 2. Diferencia de Goles, 3. Goles a Favor
    return newStandings.sort((a, b) => b.points - a.points || b.gd - a.gd);
  }, [predictions, initialTeams, matches]);


  // 2. LÓGICA DE ESCENARIOS Y PARTIDOS CLAVE
  const getTeamScenarios = (teamId) => {
    const teamIndex = standings.findIndex(t => t.id === teamId);
    const team = standings[teamIndex];
    const currentPos = teamIndex + 1;

    // Umbral del 4to lugar (Clasificación a Semifinales)
    const fourthPlace = standings[3];
    const fourthPlacePoints = fourthPlace?.points || 0;

    // Partidos que le faltan a ESTE equipo
    const teamMatches = matches.filter(m => 
      !predictions[m.id] && (m.homeId === teamId || m.awayId === teamId)
    );

    const remainingGames = teamMatches.length;
    const maxPossiblePoints = team.points + (remainingGames * 3);

    let status = "En Pelea";
    let color = "text-blue-400";
    let msg = "";

    if (currentPos <= 4) {
      status = "En Zona";
      color = "text-green-400";
      msg = "Actualmente en zona de clasificación. Mantener el ritmo asegura el pase.";
    } else if (maxPossiblePoints < fourthPlacePoints) {
      status = "Eliminado";
      color = "text-red-500";
      msg = "Sin opciones matemáticas de alcanzar el cuarto lugar.";
    } else {
      const diff = fourthPlacePoints - team.points;
      status = "En Pelea";
      color = "text-yellow-400";
      msg = `A ${diff} puntos del 4to lugar. Necesita resultados positivos en los ${remainingGames} juegos restantes.`;
    }

    // Detección de partidos CLAVE (contra Top 4 o rivales directos +/- 2 puestos)
    const keyMatches = teamMatches.filter(m => {
      const opponentId = m.homeId === teamId ? m.awayId : m.homeId;
      const opponentIndex = standings.findIndex(t => t.id === opponentId);
      const opponentPos = opponentIndex + 1;
      return opponentPos <= 4 || Math.abs(currentPos - opponentPos) <= 2;
    });

    return {
      status, color, msg, currentPos, 
      currentPoints: team.points, 
      teamMatches, keyMatches, remainingGames
    };
  };


  // 3. ANÁLISIS DE PROBABILIDADES (Monte Carlo)
  const probabilities = useMemo(() => {
    const resultsCount = {};
    initialTeams.forEach(t => resultsCount[t.id] = 0);
    
    const iterations = 1000; // Número de simulaciones
    const pendingMatches = matches.filter(m => !predictions[m.id]);

    for (let i = 0; i < iterations; i++) {
      // Copia rápida de la tabla actual con las predicciones del usuario ya aplicadas
      let tempStandings = standings.map(t => ({ ...t }));
      
      pendingMatches.forEach(m => {
        const rand = Math.random();
        const home = tempStandings.find(t => t.id === m.homeId);
        const away = tempStandings.find(t => t.id === m.awayId);
        
        // Pesos estadísticos básicos (Local 45%, Empate 25%, Visita 30%)
        if (rand < 0.45) {
          home.points += 3;
        } else if (rand < 0.75) {
          away.points += 3;
        } else {
          home.points += 1;
          away.points += 1;
        }
      });

      // Ordenar y contar quiénes quedaron en el Top 4 en esta iteración
      tempStandings.sort((a, b) => b.points - a.points);
      tempStandings.slice(0, 4).forEach(t => resultsCount[t.id]++);
    }

    return Object.keys(resultsCount).map(id => ({
      id: parseInt(id),
      percentage: (resultsCount[id] / iterations) * 100
    }));
  }, [standings, matches, predictions, initialTeams]);


  // FUNCIÓN PARA ACTUALIZAR PREDICCIONES
  const updatePrediction = (matchId, winner) => {
    setPredictions(prev => {
      // Si el usuario hace clic en el mismo resultado, lo borramos (toggle)
      if (prev[matchId] === winner) {
        const newState = { ...prev };
        delete newState[matchId];
        return newState;
      }
      return { ...prev, [matchId]: winner };
    });
  };

  return { 
    standings, 
    updatePrediction, 
    predictions, 
    getTeamScenarios, 
    probabilities 
  };
}