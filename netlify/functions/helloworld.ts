import { Handler } from "@netlify/functions";
import { createApp } from "../app";

export const handler: Handler = async (event, context) => {
  // your server-side functionality
  const name = event.queryStringParameters.name || "World";
  return {
    statusCode: 200,
    body: createApp(name),
  };
};
