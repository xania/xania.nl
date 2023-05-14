import { Attrs, State, update, useState } from "xania";
import { insert } from "~/services/firebase";

export function Subscribe() {
  const email = useState("");

  const subscribeCmd = update(async function (scope) {
    const value = await scope.get(email);
    addSubscription(value);

    return email.update("");
  });

  return (
    <>
      <input type="email">{bind(email)}</input>
      <button click={subscribeCmd}>subscribe</button>
    </>
  );
}

function addSubscription(email: string) {
  insert("subscriptions", email, { created: new Date().toUTCString() });
}

function bind(state: State<string>) {
  return Attrs<HTMLInputElement>({
    blur: (e) => state.update(e.currentTarget.value),
    value: state,
  });
}
