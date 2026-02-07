"use client";
import React, { useState } from "react";
import { useSimulator } from "../hooks/useSimulator";
import { Target, Info, RefreshCcw, Zap, LayoutGrid } from "lucide-react";

export default function LeagueClient({ initialData }) {
  const {
    standings,
    updatePrediction,
    predictions,
    getDetailedScenarios,
    getMatchPrediction,
    resetPredictions,
  } = useSimulator(initialData.teams, initialData.remainingMatches);

  const [selectedTeamId, setSelectedTeamId] = useState(initialData.teams[0].id);
  const selectedTeam = initialData.teams.find((t) => t.id === selectedTeamId);
  const scenario = getDetailedScenarios(selectedTeamId);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
      {/* SECCIÓN 50/50: TABLA Y ESCENARIOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* BLOQUE IZQUIERDO: TABLA DE POSICIONES */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center gap-3">
              <LayoutGrid className="text-blue-500" size={18} />
              <h2 className="text-lg font-black uppercase tracking-tighter italic">
                Tabla en Vivo
              </h2>
            </div>
            <button
              onClick={resetPredictions}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-white"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
          <div className="flex-grow">
            <table className="w-full">
              <thead className="bg-slate-900/80 text-[10px] uppercase text-slate-500 font-black">
                <tr>
                  <th className="px-6 py-4 text-center">#</th>
                  <th className="px-6 py-4 text-left">Club</th>
                  <th className="px-6 py-4 text-center">PJ</th>
                  <th className="px-6 py-4 text-right">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {standings.map((team, i) => (
                  <tr
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`cursor-pointer transition-all border-l-4 ${selectedTeamId === team.id ? "bg-blue-600/10 border-blue-500" : "hover:bg-white/5 border-transparent"}`}
                  >
                    <td className="px-6 py-4 text-center font-mono text-sm text-slate-500">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img
                        src={team.logo}
                        className="w-6 h-6 object-contain"
                        alt=""
                      />
                      <span className="text-xs font-black uppercase tracking-tight truncate">
                        {team.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-xs text-slate-400">
                      {team.played}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-blue-400 text-base">
                      {team.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BLOQUE DERECHO: ESCENARIOS (MISMO TAMAÑO) */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full" />

          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                <h2 className="text-xl font-black uppercase italic tracking-tighter">
                  Escenarios
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800">
                <img
                  src={selectedTeam.logo}
                  className="w-5 h-5 object-contain"
                  alt=""
                />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {selectedTeam.name}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/20 to-transparent border border-yellow-500/20 p-6 rounded-2xl flex items-center gap-4">
              <Zap
                className="text-yellow-500 fill-yellow-500 animate-pulse"
                size={24}
              />
              <span className="text-2xl font-black italic text-yellow-500">
                {(scenario?.currentProb || 0).toFixed(1)}% de clasificar
              </span>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Info size={12} /> Situación Actual
                </h3>
                <div className="grid grid-cols-1 gap-2 text-xs font-bold text-slate-300">
                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                    Probabilidad base:{" "}
                    <span className="text-blue-400">
                      {scenario.currentProb.toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                    Estatus:{" "}
                    <span className={scenario.color}>{scenario.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Target size={12} /> Partidos clave
                </h3>
                <div className="space-y-2">
                  {scenario.teamMatches.slice(0, 1).map((m) => (
                    <div
                      key={m.id}
                      className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl flex justify-between items-center"
                    >
                      <span className="text-[11px] font-black uppercase text-slate-200">
                        Ganar vs{" "}
                        {m.homeId === selectedTeamId ? m.awayName : m.homeName}
                      </span>
                      <span className="text-emerald-400 font-black">
                        +{scenario.ifWinsAll}%
                      </span>
                    </div>
                  ))}
                  {scenario.externalKeyMatches.map((m, i) => (
                    <div
                      key={m.id}
                      className="bg-slate-800/20 border border-slate-800 p-4 rounded-xl flex justify-between items-center text-[10px]"
                    >
                      <span className="text-slate-400 font-medium">
                        Necesita que{" "}
                        <strong className="text-white">{m.homeName}</strong>{" "}
                        gane
                      </span>
                      <span className="text-blue-400/60 font-black">
                        Impacto Medio
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: PARTIDOS (FULL WIDTH) */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px bg-slate-800 flex-grow" />
          <h2 className="text-2xl font-black italic uppercase text-slate-600 px-4">
            Simular Resultados
          </h2>
          <div className="h-px bg-slate-800 flex-grow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {initialData.remainingMatches.map((match) => {
            const pred = getMatchPrediction(match.homeId, match.awayId);
            const isActive =
              match.homeId === selectedTeamId ||
              match.awayId === selectedTeamId;
            return (
              <div
                key={match.id}
                className={`bg-[#0f172a] border rounded-2xl p-5 transition-all ${isActive ? "ring-1 ring-blue-500/50 border-blue-500/50" : "border-slate-800"}`}
              >
                <div className="flex justify-between items-center mb-5">
                  <div className="flex flex-col items-center w-[35%]">
                    <img
                      src={
                        initialData.teams.find((t) => t.id === match.homeId)
                          ?.logo
                      }
                      className="w-8 h-8 mb-2"
                      alt=""
                    />
                    <span className="text-[9px] font-black text-white text-center uppercase truncate w-full">
                      {match.homeName}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-black text-slate-700 italic px-2 py-1 rounded-lg border border-slate-800">
                      {match.date}
                    </span>
                  </div>
                  <div className="flex flex-col items-center w-[35%]">
                    <img
                      src={
                        initialData.teams.find((t) => t.id === match.awayId)
                          ?.logo
                      }
                      className="w-8 h-8 mb-2"
                      alt=""
                    />
                    <span className="text-[9px] font-black text-white text-center uppercase truncate w-full">
                      {match.awayName}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {["home", "draw", "away"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updatePrediction(match.id, opt)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${predictions[match.id] === opt ? "bg-blue-600 border-blue-400 text-white shadow-lg" : "bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500"}`}
                    >
                      {opt === "home" ? "1" : opt === "draw" ? "X" : "2"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
