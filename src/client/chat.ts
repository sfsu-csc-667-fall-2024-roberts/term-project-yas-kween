const form = document.querySelector("#chat-section form")! as HTMLFormElement;
const input = document.querySelector("input#chat-message")! as HTMLInputElement;
const messageTemplate = document.querySelector(
  "#chat-message-template",
)! as HTMLTemplateElement;

input.addEventListener("keydown", (keyDownEvent) => {
  if (keyDownEvent.key === "Enter") {
    form.dispatchEvent(new Event("submit"));
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = input.value;
  input.value = "";

  fetch(form.action, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  }).then((response) => {
    if (response.status !== 200) {
      console.error("Error:", response);
    }
  });
});

// IIFE
(() => {
  // @ts-expect-error TODO: Define the socket object on window for TS
  window.socket.on(
    "message:0",
    ({
      message,
      sender,
      gravatar,
    }: {
      message: string;
      sender: string;
      timestamp: string;
      gravatar: string;
    }) => {
      const messageElement = messageTemplate.content.cloneNode(
        true,
      ) as HTMLElement;
      messageElement.querySelector("img")!.src =
        `https://www.gravatar.com/avatar/${gravatar}?s=10`;
      messageElement.querySelector("img")!.alt = sender;
      messageElement.querySelector("span")!.textContent = message;

      document.querySelector("#chat-section ul")!.appendChild(messageElement);
    },
  );
})();
