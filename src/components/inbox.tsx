import { Page } from "~/layout/page";
import * as oauth2 from "oauth4webapi";

const outlook =
  "https://graph.microsoft.com/v1.0/me/mailfolders/inbox/messages";

export async function InboxApp() {
  const response = await oauth2.discoveryRequest(new URL(outlook));
  console.log(response);

  return <Page>inbox berichten</Page>;
}
