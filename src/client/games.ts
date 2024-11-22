document
  .querySelector<HTMLFormElement>("#blarg")!
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    console.log({ form });

    fetch(form.action, { method: "post" }).then((response) => {
      console.log({ response });
    });
  });
