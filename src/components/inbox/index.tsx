import {
  AccountInfo,
  AuthenticationResult,
  InteractionType,
  PublicClientApplication,
} from "@azure/msal-browser";
import { List, useState } from "xania";
import { Page } from "~/layout/page";
// import * as oauth2 from "oauth4webapi";
import { readMail, revoke, signIn, signOut } from "~/services/microsoft";
import { MSAL_CONFIG } from "~/services/microsoft/AuthModule";
import { Client } from "@microsoft/microsoft-graph-client";

import {
  AuthCodeMSALBrowserAuthenticationProvider,
  AuthCodeMSALBrowserAuthenticationProviderOptions,
} from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";

export async function InboxApp() {
  const app = createApp();
  const account = useState(getAccount(app));
  const email = account.map((account) =>
    readMail(app, account).then((e) => e?.value)
  );

  return (
    <Page>
      inbox berichten
      <div>
        <List source={email}>{(row) => <div>{row.prop("subject")}</div>}</List>
      </div>
      {account.prop("tenantId")}
      <button class="m-2 bg-slate-500 px-2 text-white" click={(e) => signIn()}>
        sign in
      </button>
      <button
        class="m-2 bg-red-500 px-2 text-white"
        click={(e) => signOut(app)}
      >
        sign out
      </button>
      <button class="m-2 bg-red-500 px-2 text-white" click={(e) => revoke(app)}>
        revoke
      </button>
    </Page>
  );
}

export function createApp() {
  return new PublicClientApplication(MSAL_CONFIG);
}

// https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/classes/_src_app_publicclientapplication_.publicclientapplication.html

function getAccount(
  myMSALObj: PublicClientApplication
): Promise<AccountInfo | undefined> {
  return myMSALObj.initialize().then(() =>
    // Redirect: once login is successful and redirects with tokens, call Graph API
    myMSALObj
      .handleRedirectPromise()
      .then((response) => {
        if (response !== null) {
          if (response.account) return response.account;
        } else {
          // need to call getAccount here?
          const currentAccounts = myMSALObj.getAllAccounts();
          if (currentAccounts === null) {
            console.log("No accounts detected");
          }

          if (currentAccounts.length > 0) {
            return currentAccounts[0];
          }
        }
        return undefined;
      })
      .catch((err) => {
        console.error(err);
        return undefined;
      })
  );
}

async function readGraph(app: PublicClientApplication, account: AccountInfo) {
  const options: AuthCodeMSALBrowserAuthenticationProviderOptions = {
    account: account, // the AccountInfo instance to acquire the token for.
    interactionType: InteractionType.Popup, // msal-browser InteractionType
    scopes: ["user.read", "mail.read"], // example of the scopes to be passed
  };

  // Pass the PublicClientApplication instance from step 2 to create AuthCodeMSALBrowserAuthenticationProvider instance
  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
    app,
    options
  );

  const client = Client.init({
    async authProvider(done) {
      try {
        const token = await authProvider.getAccessToken();
        done(null, token);
      } catch (err) {
        done(err, null);
      }
    },
  });

  let messages = await client.api("/me").get();
  console.log(messages);
}
