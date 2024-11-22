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

export const GET_PLAYER_COUNT = `
  SELECT COUNT(*) FROM game_users WHERE game_id = $1
`;

export const INSERT_INITIAL_CARDS = `
INSERT INTO game_cards (game_id, card_id, user_id, position)
SELECT $1, id, 0, uuid_generate_v4() FROM cards
`;

export const DEAL_CARDS = `
UPDATE game_cards 
SET user_id = $1 WHERE game_id = $2 AND user_id = 0 AND position IN (
  SELECT position FROM game_cards WHERE game_id = $2 AND user_id = 0 ORDER BY position LIMIT $3
) RETURNING card_id`;

export const AVAILABLE_CARDS_FOR_GAME = `
SELECT COUNT(*) FROM cards WHERE game_id = $1 AND player_id = 0
`;

export const SHUFFLE_DISCARD_PILE = `
UPDATE game_cards SET user_id = 0, position = uuid_generate_v4() WHERE user_id = -2 AND game_id = $1
`;
