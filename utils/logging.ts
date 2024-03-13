export async function logg(body: string) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
  await fetch(
    "https://webhook.site/f9f177fd-b6e2-4ec6-9d54-686d7494b143",
    options
  );
}
