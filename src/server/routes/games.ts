import express from "express";

const router = express.Router();

router.get("/:gameId", (request, response) => {
  const { gameId } = request.params;

  response.render("games/game", { title: `Game ${gameId}`, gameId });
});

router.get("/:gameId/lobby", (request, response) => {
  const { gameId } = request.params;

  response.render("games/lobby", { title: "Game lobby", gameId });
});

export default router;
