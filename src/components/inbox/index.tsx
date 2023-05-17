import { PublicClientApplication } from "@azure/msal-browser";
import { Page } from "~/layout/page";
// import * as oauth2 from "oauth4webapi";
import { readMail, signIn } from "~/services/microsoft";
import { AuthModule } from "~/services/microsoft/AuthModule";
import { FetchManager } from "~/services/microsoft/FetchManager";

const outlook =
  "https://graph.microsoft.com/v1.0/me/mailfolders/inbox/messages";

export async function InboxApp() {
  const authModule: AuthModule = new AuthModule();
  await authModule.loadAuthModule();

  // readMail();

  return <Page>inbox berichten</Page>;
}

function authorize() {
  const tenantId = "0278d500-4cee-4ff3-ba11-a727fc9c10bb";
  const clientId = "4b37929a-6080-4e19-99ae-7e91a2c68ce9";

  const url = new URL(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`
  );
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("response_mode", "query");
  url.searchParams.set("scope", "mail.read");
  url.searchParams.set("state", "123");
  // url.searchParams.set(
  //   "code_challenge",
  //   "YTFjNjI1OWYzMzA3MTI4ZDY2Njg5M2RkNmVjNDE5YmEyZGRhOGYyM2IzNjdmZWFhMTQ1ODg3NDcxY2Nl"
  // );
  // url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("redirect_uri", window.location.href);
  return fetch(url, {
    method: "POST",
  });
}
