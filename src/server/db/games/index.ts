import db from "../connection";
import {
  ADD_PLAYER,
  AVAILABLE_CARDS_FOR_GAME,
  AVAILABLE_GAMES,
  CREATE_GAME,
  DEAL_CARDS,
  GET_GAME_PLAYERS,
  GET_PLAYER_CARDS,
  GET_PLAYER_COUNT,
  INSERT_INITIAL_CARDS,
  IS_CURRENT,
  SHUFFLE_DISCARD_PILE,
} from "./sql";

type GameDescription = {
  id: number;
  players: number;
  player_count: number;
};

const create = async (playerId: number): Promise<GameDescription> => {
  const game = await db.one<GameDescription>(CREATE_GAME);

  await db.any(INSERT_INITIAL_CARDS, game.id);
  await join(playerId, game.id);

  return game;
};

const join = async (playerId: number, gameId: number) => {
  // Pile 0 is the player's hand
  await db.any(DEAL_CARDS, [playerId, 0, gameId, 7]);
  // Pile -1 is the player's play pile
  await db.any(DEAL_CARDS, [playerId, -1, gameId, 20]);

  return await db.one<GameDescription>(ADD_PLAYER, [gameId, playerId]);
};

const availableGames = async (
  limit: number = 20,
  offset: number = 0,
): Promise<
  {
    id: number;
    players: number;
    currentPlayerIsMember?: boolean;
  }[]
> => {
  return db.any(AVAILABLE_GAMES, [limit, offset]);
};

const getPlayerCount = async (gameId: number) => {
  return db.one<{ count: string }>(GET_PLAYER_COUNT, gameId);
};

const drawCard = async (playerId: number, gameId: number) => {
  const availableCards = parseInt(
    (await db.one<{ count: string }>(AVAILABLE_CARDS_FOR_GAME, gameId)).count,
  );

  if (availableCards === 0) {
    await db.none(SHUFFLE_DISCARD_PILE, [gameId]);
  }

  return db.one<{ card_id: string }>(DEAL_CARDS, [playerId, 0, gameId, 1]);
};

// user_id: -1 for top of discard pile, -2 for bottom of discard pile
// N: -3, E: -4, S: -5, W: -6
const playCard = async () =>
  // playerId: number,
  // gameId: number,
  // cardId: string,
  // pile: number
  {};

const playerGames = async (
  playerId: number,
): Promise<Record<number, boolean>> => {
  return (
    await db.any("SELECT game_id FROM game_users WHERE user_id=$1", playerId)
  ).reduce((memo, game) => ({ ...memo, [game.game_id]: true }), {});
};

const get = async (gameId: number, playerId: number) => {
  const currentSeat = await db.one(
    "SELECT current_seat FROM games WHERE id=$1",
    gameId,
  );
  const players = await db.any(GET_GAME_PLAYERS, gameId);
  const playerHand = await db.any(GET_PLAYER_CARDS, [playerId, gameId, 0, 8]);

  return {
    currentSeat,
    players,
    playerHand,
  };
};

const isCurrentPlayer = async (gameId: number, userId: number) => {
  return (await db.one(IS_CURRENT, [gameId, userId])).count === "1";
};

export default {
  create,
  join,
  availableGames,
  getPlayerCount,
  drawCard,
  playCard,
  playerGames,
  get,
  isCurrentPlayer,
};
