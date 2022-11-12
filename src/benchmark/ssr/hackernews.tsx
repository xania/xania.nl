export function HackerNewsApp() {
  return {
    async render(dom) {
      var result = await fetch("/api/HttpExample?name=ramy").then((e) =>
        e.text()
      );
      dom.innerHTML = result;
    },
  };
}
