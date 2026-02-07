## 🧠 Modelo Predictivo: Algoritmo de Monte Carlo

El núcleo de este simulador es un motor de probabilidad basado en el método de Monte Carlo. Cada vez que el usuario realiza un cambio, el sistema:

1. **Ponderación de Fortaleza:** Calcula un `win-rate` dinámico basado en los puntos obtenidos versus los jugados.
2. **Iteración Masiva:** Ejecuta 600 simulaciones aleatorias de los partidos restantes.
3. **Distribución de Probabilidad:** Determina el % de veces que un equipo termina en el Top 4 (zona de clasificación) para generar la métrica de "Chance de Playoffs".

## ⚙️ Personalización

Para adaptar este simulador a otra liga, solo debes modificar el objeto `getLeagueData` en `page.tsx`:

- **Teams:** Define `id`, `name`, `points`, `gd` (diferencia de goles) y `logo`.
- **Matches:** Define los duelos pendientes con sus respectivos `homeId` y `awayId`.

## 🎨 Filosofía de Diseño (UX)

La interfaz fue diseñada bajo la estética de **eSports Pro-Dashboards**, priorizando:

- **Contraste Crítico:** Uso de azul neón y amarillo para datos que requieren atención inmediata.
- **Simetría Informativa:** Un diseño 50/50 que permite comparar la tabla general con el análisis específico del equipo sin perder contexto.
- **Feedback Instantáneo:** Micro-animaciones en Tailwind para reflejar cambios en las probabilidades tras cada predicción.

## 🗺️ Roadmap de Desarrollo

- [ ] **Persistencia Local:** Guardar las predicciones en `localStorage` para no perder los datos al recargar.
- [ ] **Modo "What If":** Permitir simular empates masivos automáticos para ver el peor escenario posible.
- [ ] **Exportación:** Botón para descargar una imagen (captura) de la tabla proyectada.
- [ ] **Historial de Tendencias:** Gráfica de líneas que muestre cómo ha variado la probabilidad de un equipo jornada a jornada.

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - siéntete libre de usarlo, modificarlo y mejorarlo.

---

Creado con pasión por el análisis deportivo y el código limpio. ⚽💻
