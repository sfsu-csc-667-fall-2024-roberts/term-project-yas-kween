import db from "../connection";
import {
  ADD_PLAYER,
  AVAILABLE_CARDS_FOR_GAME,
  AVAILABLE_GAMES,
  CREATE_GAME,
  DEAL_CARDS,
  GET_PLAYER_COUNT,
  INSERT_INITIAL_CARDS,
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
  await db.any(DEAL_CARDS, [playerId, gameId, 7]);

  return await db.one<GameDescription>(ADD_PLAYER, [gameId, playerId]);
};

const availableGames = async (limit: number = 20, offset: number = 0) => {
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

  return db.one<{ card_id: string }>(DEAL_CARDS, [playerId, gameId, 1]);
};

// user_id: -1 for top of discard pile, -2 for bottom of discard pile
// N: -3, E: -4, S: -5, W: -6
const playCard = async () =>
  // playerId: number,
  // gameId: number,
  // cardId: string,
  // pile: number
  {};

export default {
  create,
  join,
  availableGames,
  getPlayerCount,
  drawCard,
  playCard,
};
