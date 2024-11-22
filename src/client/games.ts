// window.socket.on("thing", console.log);

document
  .querySelector<HTMLFormElement>("#blarg")!
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    fetch(form.action, { method: "post" });
  });
