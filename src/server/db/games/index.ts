import db from "../connection";
import {
  ADD_PLAYER,
  AVAILABLE_GAMES,
  CREATE_GAME,
  GET_USER_GAMES,
} from "./sql";

type GameDescription = {
  id: number;
  players: number;
  player_count: number;
};

const create = async (playerId: number): Promise<GameDescription> => {
  const game = await db.one<GameDescription>(CREATE_GAME);

  await db.one(ADD_PLAYER, [game.id, playerId, 0]);

  return game;
};

const join = async (playerId: number, gameId: number) => {
  return await db.one<GameDescription>(ADD_PLAYER, [gameId, playerId]);
};

const availableGames = async (limit: number = 20, offset: number = 0) => {
  return db.any(AVAILABLE_GAMES, [limit, offset]);
};

const getUserGameRooms = async (userId: number) => {
  return db.any(GET_USER_GAMES, [userId]);
};

export default { create, join, availableGames, getUserGameRooms };
