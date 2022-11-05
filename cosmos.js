import connect from "connect";
import { CosmosClient } from "@azure/cosmos";

export function start(config) {
  console.log("starting cosmos.....", config);
  var app = connect();

  app.use(async function (req, res, next) {
    res.writeHead(200, { "Content-Type": "application/json" });

    const queryText = await readBody(req);
    const response = await query(queryText);

    res.write(JSON.stringify(response.resources));

    res.end();
    next();
  });

  app.listen(9595);

  function query(queryText) {
    const client = new CosmosClient(config);
    const container = client
      .database(config.database)
      .container(config.container);

    const result = container.items.query(queryText);

    return result.fetchAll();
  }
}
function readBody(r) {
  return new Promise((resolve) => {
    var body = new Uint8Array([]);
    r.on("data", function (chunk) {
      var mergedArray = new Uint8Array(body.length + chunk.length);
      mergedArray.set(body);
      mergedArray.set(chunk, body.length);

      body = mergedArray;
    });
    r.on("end", function () {
      const text = new TextDecoder("utf-8").decode(body);
      resolve(text);
    });
  });
}
