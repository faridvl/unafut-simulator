// src/app/page.tsx
import LeagueClient from '../src/components/LeagueClient';

async function getLeagueData() {
  return {
    teams: [
      { id: 1, name: "Alajuelense", points: 28, gd: 14, played: 12, logo: "https://escudosfc.com.br/images/alajuelense_cos.png" },
      { id: 2, name: "Saprissa", points: 26, gd: 11, played: 12, logo: "https://escudosfc.com.br/images/saprissa_cos.png" },
      { id: 3, name: "San Carlos", points: 24, gd: 7, played: 12, logo: "https://escudosfc.com.br/images/sancarlos_cos.png" },
      { id: 4, name: "Herediano", points: 22, gd: 6, played: 12, logo: "https://escudosfc.com.br/images/heredia.png" },
      { id: 5, name: "Guadalupe FC", points: 21, gd: 2, played: 12, logo: "https://escudosfc.com.br/images/guadalupe_cos.png" },
      { id: 6, name: "Cartaginés", points: 19, gd: 1, played: 12, logo: "https://escudosfc.com.br/images/cartag.png" },
      { id: 7, name: "Liberia", points: 16, gd: 0, played: 12, logo: "https://escudosfc.com.br/images/liberia_cos.jpg" },
      { id: 8, name: "Sporting FC", points: 15, gd: -3, played: 12, logo: "https://escudosfc.com.br/images/sporting_cos.png" },
      { id: 9, name: "Pérez Zeledón", points: 11, gd: -8, played: 12, logo: "https://escudosfc.com.br/images/zelendon_cos.png" },
      { id: 10, name: "Puntarenas", points: 9, gd: -10, played: 12, logo: "https://escudosfc.com.br/images/puntarenas_cos.png" },
    ],
    remainingMatches: [
      { id: 301, homeId: 2, awayId: 3, homeName: "Saprissa", awayName: "San Carlos", date: "Feb 10" },
      { id: 302, homeId: 1, awayId: 8, homeName: "Alajuelense", awayName: "Sporting FC", date: "Feb 10" }, // Corregido ID
      { id: 303, homeId: 4, awayId: 5, homeName: "Herediano", awayName: "Guadalupe FC", date: "Feb 11" },
      { id: 304, homeId: 6, awayId: 7, homeName: "Cartaginés", awayName: "Liberia", date: "Feb 11" },
      { id: 305, homeId: 3, awayId: 1, homeName: "San Carlos", awayName: "Alajuelense", date: "Feb 17" },
      { id: 306, homeId: 5, awayId: 2, homeName: "Guadalupe FC", awayName: "Saprissa", date: "Feb 17" },
      { id: 307, homeId: 7, awayId: 4, homeName: "Liberia", awayName: "Herediano", date: "Feb 18" },
      { id: 308, homeId: 1, awayId: 2, homeName: "Alajuelense", awayName: "Saprissa", date: "Feb 24" },
      { id: 309, homeId: 4, awayId: 3, homeName: "Herediano", awayName: "San Carlos", date: "Feb 24" },
      { id: 310, homeId: 6, awayId: 5, homeName: "Cartaginés", awayName: "Guadalupe FC", date: "Feb 25" },
    ]
  };
}

export default async function Home() {
  const data = await getLeagueData();

  return (
    <main className="min-h-screen bg-[#0b1120] py-8">
      <div className="container mx-auto px-4">
        {/* Header estilo ESPN/365Scores */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Live Simulator</span>
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">
            LIGA PROMERICA <span className="text-blue-500">2026</span>
          </h1>
          <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full" />
        </div>

        <LeagueClient initialData={data} />
      </div>
    </main>
  );
}