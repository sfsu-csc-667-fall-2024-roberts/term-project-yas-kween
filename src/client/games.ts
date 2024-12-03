document
  .querySelector<HTMLFormElement>("#draw-pile")!
  .addEventListener("click", (event) => {
    const gameId = (event.target as HTMLDivElement).dataset.gameId;

    fetch(`/games/${gameId}/draw`, { method: "POST" });
  });
