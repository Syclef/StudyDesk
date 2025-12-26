export type GameKey = "card-picker" | "card-hunter";

export function getHighScore(game: GameKey): number {
  return Number(localStorage.getItem(`auditstudydesk:${game}:high-score`)) || 0;
}

export function saveHighScore(game: GameKey, score: number) {
  const key = `auditstudydesk:${game}:high-score`;
  const stored = Number(localStorage.getItem(key)) || 0;
  if (score > stored) {
    localStorage.setItem(key, String(score));
  }
}

export function addHistory(
  game: GameKey,
  score: number,
  time: number
) {
  const key = `auditstudydesk:${game}:history`;
  const history = JSON.parse(localStorage.getItem(key) || "[]");

  history.unshift({
    score,
    time,
    date: new Date().toISOString()
  });

  localStorage.setItem(key, JSON.stringify(history.slice(0, 20)));
}

export function getHistory(game: GameKey) {
  return JSON.parse(
    localStorage.getItem(`auditstudydesk:${game}:history`) || "[]"
  );
}

export function setLastPlayed(game: GameKey) {
  localStorage.setItem(
    `auditstudydesk:${game}:last-played`,
    new Date().toISOString()
  );
}

export function getLastPlayed(game: GameKey) {
  return localStorage.getItem(`auditstudydesk:${game}:last-played`);
}

export function resetGame(game: GameKey) {
  localStorage.removeItem(`auditstudydesk:${game}:high-score`);
  localStorage.removeItem(`auditstudydesk:${game}:history`);
  localStorage.removeItem(`auditstudydesk:${game}:last-played`);
}

export function resetAllGames() {
  resetGame("card-picker");
  resetGame("card-hunter");
}
