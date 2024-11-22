// TODO jrob fix this plox
window.socket.on("game-starting", () => {
  console.log("Game starting!");
  window.location.href = `/games/${window.roomId}`;
});

window.socket.on("player-joined", ({ username, email, gravatar }) => {
  console.log("Player joined!", { username, email, gravatar });
});
