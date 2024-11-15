const form = document.querySelector("#chat-section form")! as HTMLFormElement;
const input = document.querySelector("input#chat-message")! as HTMLInputElement;
const messageArea = document.querySelector(
  "#chat-section ul",
)! as HTMLUListElement;
const messageTemplate = document.querySelector(
  "#chat-message-template",
)! as HTMLTemplateElement;

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
        `https://www.gravatar.com/avatar/${gravatar}`;
      messageElement.querySelector("img")!.alt = sender;
      messageElement.querySelector("span")!.textContent = message;

      messageArea.appendChild(messageElement);
      messageArea.scrollTo(0, messageArea.scrollHeight);
    },
  );
})();
