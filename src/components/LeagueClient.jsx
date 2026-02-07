"use client";
import React, { useState, useMemo } from 'react';
import { useSimulator } from '../hooks/useSimulator';
import { 
  Trophy, PlayCircle, Target, BarChart3, 
  Dices, AlertCircle, TrendingUp, Calendar, 
  ChevronRight, Info
} from 'lucide-react';

export default function LeagueClient({ initialData }) {
  const { 
    standings, 
    updatePrediction, 
    predictions, 
    getTeamScenarios, 
    probabilities 
  } = useSimulator(initialData.teams, initialData.remainingMatches);

  const [selectedTeamId, setSelectedTeamId] = useState(initialData.teams[0].id);

  // Agrupamos partidos por jornada (round)
  const matchesByRound = useMemo(() => {
    return initialData.remainingMatches.reduce((acc, m) => {
      const round = m.round || "Restantes";
      if (!acc[round]) acc[round] = [];
      acc[round].push(m);
      return acc;
    }, {});
  }, [initialData.remainingMatches]);

  const scenario = getTeamScenarios(selectedTeamId);
  const selectedTeam = initialData.teams.find(t => t.id === selectedTeamId);

  const cardClass = "bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden";

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-700">
      
      {/* --- HEADER DE ESTADÍSTICAS RÁPIDAS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${cardClass} p-4 flex items-center gap-4 bg-gradient-to-br from-blue-600/20 to-transparent`}>
          <img src={standings[0].logo} alt="Líder" className="w-10 h-10 object-contain shadow-lg" />
          <div>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Líder Actual</p>
            <p className="text-sm font-bold text-white truncate">{standings[0].name}</p>
          </div>
        </div>
        <div className={`${cardClass} p-4 flex items-center gap-4`}>
          <div className="p-3 bg-slate-800 rounded-xl text-blue-400"><TrendingUp size={20}/></div>
          <div>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Corte Top 4</p>
            <p className="text-sm font-bold text-white">{standings[3].points} Puntos</p>
          </div>
        </div>
        <div className={`${cardClass} p-4 flex items-center gap-4`}>
          <div className="p-3 bg-slate-800 rounded-xl text-purple-400"><Calendar size={20}/></div>
          <div>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Simulados</p>
            <p className="text-sm font-bold text-white">{Object.keys(predictions).length} / {initialData.remainingMatches.length}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            initialData.remainingMatches.forEach(m => 
              updatePrediction(m.id, ['home', 'draw', 'away'][Math.floor(Math.random()*3)])
            );
          }}
          className={`${cardClass} p-4 flex items-center justify-center gap-3 hover:bg-blue-600 transition-all group`}
        >
          <Dices className="text-blue-400 group-hover:text-white group-hover:rotate-12 transition-all" size={20} />
          <span className="font-black text-[10px] uppercase text-white tracking-widest">Simular Todo</span>
        </button>
      </div>

      {/* --- DASHBOARD PRINCIPAL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COL IZQUIERDA: TABLA POSICIONES (7 Cols) */}
        <div className={`${cardClass} lg:col-span-7`}>
          <div className="p-6 border-b border-slate-800 bg-[#1e293b]/50 flex justify-between items-center">
            <h2 className="text-lg font-black text-white flex items-center gap-3 uppercase tracking-tighter">
              <Trophy className="text-yellow-500" size={20} /> Clasificación Proyectada
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0f172a] text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4 text-center w-12">#</th>
                  <th className="p-4">Club</th>
                  <th className="p-4 text-center">PJ</th>
                  <th className="p-4 text-center">GD</th>
                  <th className="p-4 text-right text-blue-400">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {standings.map((team, i) => (
                  <tr key={team.id} 
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`cursor-pointer transition-all ${selectedTeamId === team.id ? 'bg-blue-600/20' : 'hover:bg-white/5'} ${i < 4 ? 'border-l-[3px] border-l-blue-500' : 'border-l-[3px] border-l-transparent'}`}
                  >
                    <td className="p-4 text-center font-mono text-slate-500 font-bold">{i + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={team.logo} alt={team.name} className="w-6 h-6 object-contain" />
                        <span className="font-black text-white tracking-tight uppercase text-xs">{team.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono text-slate-400">{team.played}</td>
                    <td className="p-4 text-center font-mono text-slate-400">{team.gd}</td>
                    <td className="p-4 text-right font-black text-lg text-blue-400">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COL DERECHA: ANALIZADOR Y SIMULADOR (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* PANEL ANALIZADOR DINÁMICO */}
          <div className={`${cardClass} bg-gradient-to-br from-slate-800 to-[#1e293b] p-6 border-b-4 border-b-blue-500`}>
            <div className="flex items-center gap-5 mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-xl">
                <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-12 h-12 object-contain" />
              </div>
              <div>
                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase mb-1 inline-block border ${scenario.color} border-current`}>
                  {scenario.status}
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{selectedTeam.name}</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
                <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Chance Playoffs</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-white">
                    {probabilities.find(p => p.id === selectedTeamId)?.percentage.toFixed(1)}%
                  </span>
                  <BarChart3 size={14} className="text-blue-500 mb-1" />
                </div>
              </div>
              <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
                <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Duelos Directos</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-white">{scenario.keyMatches.length}</span>
                  <Target size={14} className="text-red-500 mb-1" />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <Info size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Análisis de Datos</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">{scenario.msg}</p>
            </div>
          </div>

          {/* SIMULADOR DE PARTIDOS */}
          <div className={`${cardClass} flex flex-col`}>
            <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <PlayCircle size={16} className="text-blue-500" /> Próximas Fechas
              </h3>
            </div>
            <div className="overflow-y-auto max-h-[500px] p-4 space-y-8 custom-scrollbar">
              {Object.entries(matchesByRound).map(([round, roundMatches]) => (
                <div key={round} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 uppercase tracking-widest">Jornada {round}</span>
                    <div className="h-[1px] flex-1 bg-slate-800" />
                  </div>
                  {roundMatches.map(match => (
                    <div key={match.id} className="bg-[#0f172a] rounded-2xl p-4 border border-slate-800/50 hover:border-slate-600 transition-all">
                      <div className="flex justify-between items-center mb-4">
                        {/* Equipo Local */}
                        <div className="w-[35%] flex flex-col items-center gap-2">
                          <img src={initialData.teams.find(t => t.id === match.homeId).logo} className="w-8 h-8 object-contain" alt="" />
                          <span className={`text-[10px] font-black text-center truncate w-full ${match.homeId === selectedTeamId ? 'text-blue-400' : 'text-white'}`}>
                            {match.homeName}
                          </span>
                        </div>

                        <div className="text-[10px] font-black text-slate-700 italic">VS</div>

                        {/* Equipo Visita */}
                        <div className="w-[35%] flex flex-col items-center gap-2">
                          <img src={initialData.teams.find(t => t.id === match.awayId).logo} className="w-8 h-8 object-contain" alt="" />
                          <span className={`text-[10px] font-black text-center truncate w-full ${match.awayId === selectedTeamId ? 'text-blue-400' : 'text-white'}`}>
                            {match.awayName}
                          </span>
                        </div>
                      </div>

                      {/* Botones de Selección */}
                      <div className="flex gap-2">
                        {[
                          { id: 'home', label: '1' },
                          { id: 'draw', label: 'X' },
                          { id: 'away', label: '2' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => updatePrediction(match.id, opt.id)}
                            className={`flex-1 py-2 rounded-lg text-xs font-black transition-all border ${
                              predictions[match.id] === opt.id 
                              ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] scale-[1.02]' 
                              : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER INFORMATIVO */}
      <footer className={`${cardClass} p-4 bg-slate-900/50 border-none flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <AlertCircle size={14} className="text-slate-500" />
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">
            Simulador Liga Promerica 2026 • Datos No Oficiales • Motor de Probabilidades Monte Carlo
          </p>
        </div>
        <div className="text-[9px] text-slate-600 font-bold uppercase">
          Build v1.0.4-stable
        </div>
      </footer>
    </div>
  );
}