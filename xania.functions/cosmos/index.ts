import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { section } from "../config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const client = req.params.client;

  const config = section(client, {
    cosmos: {
      endpoint: null,
      key: null,
      database: null,
      container: null,
    },
  });

  if (config instanceof Error) {
    throw config;
  }

  var cosmos = new CosmosClient({
    endpoint: config.cosmos.endpoint,
    key: config.cosmos.key,
  });

  const container = cosmos
    .database(config.cosmos.database)
    .container(config.cosmos.container);

  const queryText = req.body;

  const iterator = container.items.query(queryText);
  const response = await iterator.fetchAll();

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(response.resources),
  };
};

export default httpTrigger;
