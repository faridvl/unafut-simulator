"use client";
import { useState, useMemo } from 'react';

export function useSimulator(initialTeams, matches) {
  const [predictions, setPredictions] = useState({});

  // 1. CÁLCULO DE LA TABLA DINÁMICA
  const standings = useMemo(() => {
    let newStandings = initialTeams.map(t => ({ 
      ...t, 
      played: t.played || 0,
      points: t.points || 0,
      gd: t.gd || 0
    }));

    matches.forEach(match => {
      const result = predictions[match.id];
      if (!result) return;

      const home = newStandings.find(t => t.id === match.homeId);
      const away = newStandings.find(t => t.id === match.awayId);

      home.played += 1;
      away.played += 1;

      if (result === 'home') {
        home.points += 3;
        home.gd += 1;
        away.gd -= 1;
      } else if (result === 'away') {
        away.points += 3;
        away.gd += 1;
        home.gd -= 1;
      } else if (result === 'draw') {
        home.points += 1;
        away.points += 1;
      }
    });

    return newStandings.sort((a, b) => b.points - a.points || b.gd - a.gd);
  }, [predictions, initialTeams, matches]);

  // 2. LÓGICA DE PROBABILIDAD POR PARTIDO (Power Ranking)
  const getMatchPrediction = (homeId, awayId) => {
    const getWinRate = (id) => {
      const team = initialTeams.find(t => t.id === id);
      return (team.points / (team.played * 3)) * 100 || 50;
    };

    const homeForm = getWinRate(homeId);
    const awayForm = getWinRate(awayId);
    const total = homeForm + awayForm;

    return {
      homeProb: Math.round((homeForm / total) * 100),
      awayProb: Math.round((awayForm / total) * 100),
      favorite: homeForm > awayForm ? 'home' : 'away'
    };
  };

  // 3. ANÁLISIS DE ESCENARIOS (Estilo Fnatic)
  const getTeamScenarios = (teamId) => {
    const teamIndex = standings.findIndex(t => t.id === teamId);
    const team = standings[teamIndex];
    const currentPos = teamIndex + 1;
    const fourthPlacePoints = standings[3]?.points || 0;

    const teamMatches = matches.filter(m => !predictions[m.id] && (m.homeId === teamId || m.awayId === teamId));
    
    // Partidos clave de otros (que afectan al top 4)
    const externalKeyMatches = matches.filter(m => 
      !predictions[m.id] && m.homeId !== teamId && m.awayId !== teamId &&
      (standings.findIndex(t => t.id === m.homeId) < 5 || standings.findIndex(t => t.id === m.awayId) < 5)
    ).slice(0, 3);

    const currentProb = probabilities.find(p => p.id === teamId)?.percentage || 0;

    let status = currentPos <= 4 ? "En Zona" : "En Pelea";
    let color = currentPos <= 4 ? "text-green-400" : "text-yellow-400";
    let msg = currentPos <= 4 
      ? `Si mantiene el ritmo, clasifica con un ${currentProb.toFixed(1)}% de certeza.`
      : `Necesita recuperar ${fourthPlacePoints - team.points} puntos para entrar al Top 4.`;

    return {
      status, color, msg, currentPos, 
      currentPoints: team.points,
      teamMatches, 
      externalKeyMatches,
      currentProb,
      ifWinsAll: Math.min(currentProb + 35, 100).toFixed(1),
      worstCase: Math.max(currentProb - 40, 0).toFixed(1)
    };
  };

  // 4. MONTE CARLO (Probabilidades Globales)
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
        if (rand < 0.45) home.points += 3;
        else if (rand < 0.75) away.points += 3;
        else { home.points += 1; away.points += 1; }
      });
      tempStandings.sort((a, b) => b.points - a.points).slice(0, 4).forEach(t => resultsCount[t.id]++);
    }

    return Object.keys(resultsCount).map(id => ({
      id: parseInt(id),
      percentage: (resultsCount[id] / iterations) * 100
    }));
  }, [standings, matches, predictions, initialTeams]);

  const updatePrediction = (matchId, winner) => {
    setPredictions(prev => prev[matchId] === winner ? (({[matchId]: _, ...r}) => r)(prev) : ({...prev, [matchId]: winner}));
  };

  return { standings, updatePrediction, predictions, getTeamScenarios, probabilities, getMatchPrediction };
}