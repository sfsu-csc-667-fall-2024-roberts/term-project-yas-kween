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
  // TODO in client code, disconnect socket prior to submitting creation form
  // @ts-expect-error TODO: Define the session type for the user object
  const { id: user_id } = request.session.user;

  const game = await Games.create(user_id!);

  request.app.get("io").emit("game-created", game);

  response.redirect(`/games/${game.id}`);
});

router.post("/join/:gameId", async (request, response) => {
  // @ts-expect-error TODO: Define the session type for the user object
  const { id: user_id, username, email, gravatar } = request.session.user;
  const { gameId } = request.params;

  // TODO Check to make sure user is not already in this game

  const { count } = await Games.getPlayerCount(parseInt(gameId, 10));

  const playerCount = parseInt(count, 10);

  if (playerCount === 2) {
    response.redirect("/lobby");
    return;
  }

  const game = await Games.join(user_id, parseInt(gameId, 10));

  // TODO jrob wtf; clients not receiving game-starting message
  if (playerCount === 1) {
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

router.get("/:gameId", async (request, response) => {
  const { gameId } = request.params;
  // @ts-expect-error TODO: Define the session type for the user object
  const { id: userId } = request.session.user;

  const game = await Games.get(parseInt(gameId, 10), userId);
  console.log(game);

  response.render("games/game", {
    title: `Game ${gameId}`,
    gameId,
    game,
    userId,
  });
});

router.post("/:gameId/draw", async (request, response) => {
  // Make sure its the player's turn
  const { gameId } = request.params;
  // @ts-expect-error TODO: Define the session type for the user object
  const { id: userId } = request.session.user;

  // Make sure the player is in this game
  const isCurrentPlayer = await Games.isCurrentPlayer(
    parseInt(gameId, 10),
    userId,
  );

  if (!isCurrentPlayer) {
    return;
  } else {
    // TODO: Make sure the player has not drawn a card this turn
    await Games.drawCard(userId, parseInt(gameId, 10));
    // Emit update message
  }

  response.json({});
});

router.get("/:gameId/lobby", (request, response) => {
  const { gameId } = request.params;

  response.render("games/lobby", { title: "Game lobby", gameId });
});

export default router;
