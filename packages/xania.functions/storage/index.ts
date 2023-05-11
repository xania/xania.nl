import { Context, HttpRequest } from "@azure/functions";
import { section } from "../config";

export default async function httpTrigger(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.res = {
    status: 200,
  };

  const config = section(req.params.client, {
    storage: {},
  });

  if (config instanceof Error) {
    context.res = {
      status: 500,
      body: config.message,
    };
    return;
  }

  var rawBody = req.rawBody as string;
  console.log(rawBody);
  if (rawBody) {
    context.res = {
      status: 200,
      body: rawBody,
      headers: {
        "Content-Type": "application/json",
      },
    };
    return;
  }
}
