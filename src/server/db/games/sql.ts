export const CREATE_GAME = `
INSERT INTO games DEFAULT VALUES RETURNING *, 1 as players
`;

export const ADD_PLAYER = `
INSERT INTO game_users (game_id, user_id, seat)
VALUES ($1, $2, (SELECT COUNT(*) FROM game_users WHERE game_id = $1) + 1)
RETURNING 
  game_id AS id, 
  (SELECT COUNT(*) FROM game_users WHERE game_id = $1) AS players,
  (SELECT player_count FROM games WHERE id = $1) AS player_count
`;

export const AVAILABLE_GAMES = `
SELECT *, 
  (SELECT COUNT(*) FROM game_users WHERE games.id=game_users.game_id) AS players 
FROM games WHERE id IN 
  (SELECT game_id FROM game_users GROUP BY game_id HAVING COUNT(*) < 4)
LIMIT $1
OFFSET $2
`;
