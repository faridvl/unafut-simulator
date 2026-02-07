// src/services/api.js
export const fetchLeagueData = async () => {
  // Aquí llamarías a API-Football o a tu propio JSON
  const response = await fetch('/data/unafut.json');
  return response.json();
};