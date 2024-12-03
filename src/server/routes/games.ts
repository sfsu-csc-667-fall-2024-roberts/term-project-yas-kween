import express from "express";
import { Games } from "../db";

const router = express.Router();

router.post("/do-a-thing/:gameId", (request, response) => {
  const { gameId } = request.params;

  // Do a thing
  response.send(`Did a thing for game ${gameId}`);

  request.app
    .get("io")
    .to(`game-${gameId}`)
    .emit("thing", { thing: "thing", ts: Date.now() });
});

router.post("/create", async (request, response) => {
  // @ts-expect-error TODO: Define the session type for the user object
  const { id: user_id } = request.session.user;

  const game = await Games.create(user_id!);

  request.app.get("io").emit("game-created", game);

  response.redirect(`/games/${game.id}/lobby`);
});

router.post("/join/:gameId", async (request, response) => {
  // @ts-expect-error TODO: Define the session type for the user object
  const { id: user_id, username, email, gravatar } = request.session.user;
  const { gameId } = request.params;

  // TODO Check to make sure user is not already in this game

  const { count } = await Games.getPlayerCount(parseInt(gameId, 10));

  const playerCount = parseInt(count, 10);

  if (playerCount === 4) {
    response.redirect("/lobby");
    return;
  }

  const game = await Games.join(user_id, parseInt(gameId, 10));

  // TODO jrob wtf; clients not receiving game-starting message
  if (playerCount === 3) {
    response.redirect(`/games/${gameId}`);
    request.app.get("io").to(`game-${gameId}`).emit("game-starting", game);
  } else {
    response.redirect(`/games/${gameId}/lobby`);
    request.app
      .get("io")
      .to(`game-${gameId}`)
      .emit("player-joined", { username, email, gravatar });
  }
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
