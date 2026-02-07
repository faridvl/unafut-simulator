"use client";
import { useState, useMemo } from 'react';

export function useSimulator(initialTeams, matches) {
  const [predictions, setPredictions] = useState({});

  // 1. CÁLCULO DE LA TABLA (Clasificación Actual)
  const standings = useMemo(() => {
    let newStandings = initialTeams.map(t => ({ 
      ...t, 
      played: t.played || 0,
      wins: t.wins || 0,
      draws: t.draws || 0,
      losses: t.losses || 0 
    }));

    matches.forEach(match => {
      const result = predictions[match.id];
      if (!result) return;

      const home = newStandings.find(t => t.id === match.homeId);
      const away = newStandings.find(t => t.id === match.awayId);

      home.played += 1;
      away.played += 1;

      if (result === 'home') {
        home.points += 3; home.wins += 1;
        away.losses += 1;
      } else if (result === 'away') {
        away.points += 3; away.wins += 1;
        home.losses += 1;
      } else {
        home.points += 1; home.draws += 1;
        away.points += 1; away.draws += 1;
      }
    });

    // Criterio UNAFUT: 1. Puntos, 2. GD (Diferencia), 3. Goles Favor
    return newStandings.sort((a, b) => b.points - a.points || b.gd - a.gd);
  }, [predictions, initialTeams, matches]);

  // 2. LÓGICA DE ESCENARIOS (¿Qué necesita X equipo?)
  const getTeamScenarios = (teamId) => {
    const team = standings.find(t => t.id === teamId);
    const fourthPlacePoints = standings[3]?.points || 0;
    const diff = fourthPlacePoints - team.points;

    if (standings.findIndex(t => t.id === teamId) < 4) {
      return { status: 'Clasificado', color: 'text-green-400', msg: "Actualmente en zona de clasificación." };
    }
    
    const remaining = matches.filter(m => !predictions[m.id] && (m.homeId === teamId || m.awayId === teamId)).length;
    const maxPossible = team.points + (remaining * 3);

    if (maxPossible < fourthPlacePoints) {
      return { status: 'Eliminado', color: 'text-red-400', msg: "Matemáticamente sin opciones de Top 4." };
    }
    return { status: 'En pelea', color: 'text-yellow-400', msg: `Necesita recuperar ${diff} puntos en ${remaining} juegos.` };
  };

  // 3. ANÁLISIS DE PROBABILIDADES (Simulación de Monte Carlo)
  // Simulamos 1000 finales de torneo aleatorios para obtener porcentajes
  const probabilities = useMemo(() => {
    const resultsCount = {};
    initialTeams.forEach(t => resultsCount[t.id] = 0);
    
    const iterations = 1000;
    const pendingMatches = matches.filter(m => !predictions[m.id]);

    for (let i = 0; i < iterations; i++) {
      let tempStandings = standings.map(t => ({ ...t }));
      
      pendingMatches.forEach(m => {
        const rand = Math.random();
        const home = tempStandings.find(t => t.id === m.homeId);
        const away = tempStandings.find(t => t.id === m.awayId);
        
        if (rand < 0.45) home.points += 3; // Gana local
        else if (rand < 0.75) away.points += 3; // Gana visita
        else { home.points += 1; away.points += 1; } // Empate
      });

      tempStandings.sort((a, b) => b.points - a.points);
      tempStandings.slice(0, 4).forEach(t => resultsCount[t.id]++);
    }

    return Object.keys(resultsCount).map(id => ({
      id: parseInt(id),
      percentage: (resultsCount[id] / iterations) * 100
    }));
  }, [standings, matches, predictions, initialTeams]);

  const updatePrediction = (matchId, winner) => {
    setPredictions(prev => ({ ...prev, [matchId]: winner === prev[matchId] ? null : winner }));
  };

  return { standings, updatePrediction, predictions, getTeamScenarios, probabilities };
}