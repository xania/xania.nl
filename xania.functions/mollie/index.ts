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

  var rawBody = req.rawBody as string;
  if (rawBody) {
    var fields = rawBody.split("&").reduce((prev, curr) => {
      const [key, value] = curr
        .split("=")
        .map(decodeURIComponent)
        .map(decodeURI);
      if (prev) {
        if (prev[key]) {
          prev[key] += ",+" + value;
        } else {
          prev[key] = value;
        }
        return prev;
      } else {
        return { [key]: value };
      }
    }, {} as { [k: string]: string });

    var mollieClient = createMollieClient({ apiKey: config.mollie.apiKey });

    var payment = await mollieClient.payments.create({
      description: fields["Description"],
      amount: {
        currency: fields.Currency,
        value: fields.Amount,
      },
      redirectUrl: config.mollie.redirectUrl,
    });

    context.res = {
      status: 302,
      headers: {
        Location: payment._links.checkout?.href,
      },
    };
    return;
  }
}
