import { Context, HttpRequest } from "@azure/functions";
import createMollieClient from "@mollie/api-client";
import { section } from "../config";

export default async function httpTrigger(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const config = section(req.params.client, {
    mollie: {
      apiKey: null,
      redirectUrl: req.headers["referer"],
    },
  });

  if (config instanceof Error) {
    context.res = {
      status: 500,
      body: config.message,
    };
    return;
  }

  var mollieClient = createMollieClient({ apiKey: config.mollie.apiKey });

  var payment = await mollieClient.payments.create({
    description: "test description",
    amount: {
      currency: "EUR",
      value: "10.00",
    },
    redirectUrl: config.mollie.redirectUrl,
  });

  context.res = {
    status: 302,
    headers: {
      Location: payment._links.checkout?.href,
    },
  };
}
