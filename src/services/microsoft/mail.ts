import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { MSAL_CONFIG } from "./AuthModule";
import { AuthCodeMSALBrowserAuthenticationProviderOptions } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";

export function createApp() {
  return new PublicClientApplication(MSAL_CONFIG);
}

// https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/classes/_src_app_publicclientapplication_.publicclientapplication.html

export function getAccount(
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
