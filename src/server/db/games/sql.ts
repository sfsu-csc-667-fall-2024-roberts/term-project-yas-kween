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
INSERT INTO game_cards (game_id, card_id, user_id, position, pile)
SELECT $1, id, 0, uuid_generate_v4(), -1 FROM cards
`;

export const DEAL_CARDS = `
UPDATE game_cards 
SET user_id = $1, pile = $2 WHERE game_id = $3 AND user_id = 0 AND position IN (
  SELECT position FROM game_cards WHERE game_id = $3 AND user_id = 0 ORDER BY position LIMIT $4
) RETURNING card_id`;

export const AVAILABLE_CARDS_FOR_GAME = `
SELECT COUNT(*) FROM game_cards WHERE game_id = $1 AND user_id = 0
`;

export const SHUFFLE_DISCARD_PILE = `
UPDATE game_cards SET user_id = 0, position = uuid_generate_v4() WHERE user_id = -2 AND game_id = $1
`;

const PLAY_PILE_TOP_SUBQUERY = `
SELECT cards.value 
FROM game_cards, cards 
WHERE game_cards.user_id=users.id 
  AND game_cards.game_id=$1 
  AND game_cards.card_id=cards.id 
  AND pile=-1 
ORDER BY position DESC LIMIT 1
`;
const discardPileSubquery = (pile: number) => `
SELECT cards.value FROM game_cards, cards
WHERE game_cards.user_id=users.id 
  AND game_cards.game_id=$1 
  AND game_cards.card_id=cards.id 
  AND pile=${pile}
ORDER BY position DESC
`;

export const GET_GAME_PLAYERS = `
SELECT 
  users.id, 
  users.username, 
  users.gravatar,
  (SELECT games.current_seat FROM games WHERE games.id=$1) = game_users.seat AS is_player_turn,
  game_users.seat,
  (${PLAY_PILE_TOP_SUBQUERY}) AS play_pile_top,
  array(${discardPileSubquery(1)}) AS pile_1,
  array(${discardPileSubquery(2)}) AS pile_2,
  array(${discardPileSubquery(3)}) AS pile_3,
  array(${discardPileSubquery(4)}) AS pile_4
FROM users, game_users
WHERE users.id = game_users.user_id AND game_users.game_id = $1`;

// Cards in hand
export const GET_PLAYER_CARDS = `
SELECT * FROM game_cards, cards 
WHERE game_cards.user_id=$1 
  AND game_cards.game_id=$2 
  AND game_cards.card_id=cards.id 
  AND pile=$3
ORDER BY position DESC
LIMIT $4;
`;

export const IS_CURRENT = `
SELECT COUNT(*)
FROM game_users, games 
WHERE games.id = $1 
  AND game_users.user_id = $2 
  AND games.current_seat = game_users.seat`;
