import express from "express";
import { Games } from "../db";

const router = express.Router();

router.post("/create", async (request, response) => {
  // @ts-expect-error TODO update session to include user id
  const { id: user_id } = request.session.user;
  const game = await Games.create(user_id);

  request.app.get("io").emit("game-created", game);

  response.redirect(`/games/${game.id}`);
});

router.post("/join/:gameId", async (request, response) => {
  // @ts-expect-error TODO update session to include user id
  const { id: user_id } = request.session.user;
  const { gameId } = request.params;

  const game = await Games.join(user_id, parseInt(gameId, 10));

  request.app.get("io").emit("game-updated", game);

  // Validate:
  // - Check to make sure user is not already in this game
  // - Check to make sure game is not full
  // - Check to make sure password is correct if required

  response.redirect(`/games/${gameId}`);
});

router.get("/:gameId", (request, response) => {
  const { gameId } = request.params;

  response.render("games/game", { title: `Game ${gameId}`, gameId });
});

router.get("/:gameId/lobby", (request, response) => {
  const { gameId } = request.params;

  response.render("games/lobby", { title: "Game lobby", gameId });
});

export default router;
