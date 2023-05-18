import { AuthModule, getMailTokenRedirect, getTokenPopup } from "./AuthModule";
import { FetchManager, callEndpointWithToken } from "./FetchManager";
import { UIManager } from "./UIManager";
import { GRAPH_CONFIG } from "./Constants";
import {
  AccountInfo,
  EndSessionRequest,
  PublicClientApplication,
} from "@azure/msal-browser";
import { MailInfo } from "./GraphReponseTypes";

// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const isIE = msie > 0 || msie11 > 0;

const authModule: AuthModule = new AuthModule();
const networkModule: FetchManager = new FetchManager();

// Load auth module when browser window loads. Only required for redirect flows.
window.addEventListener("load", async () => {
  authModule.loadAuthModule();
});

/**
 * Called when user clicks "Sign in with Redirect" or "Sign in with Popup"
 * @param method
 */
export function signIn(method: string = "loginRedirect"): void {
  const signInType = isIE ? "loginRedirect" : method;
  authModule.login(signInType);
}

/**
 * Called when user clicks "Sign Out"
 */
export function signOut(myMSALObj: PublicClientApplication): void {
  const currentAccounts = myMSALObj.getAllAccounts();
  const account = currentAccounts[0];
  const logOutRequest: EndSessionRequest = {
    account,
  };

  myMSALObj.logoutRedirect(logOutRequest);
}

/**
 * Called when user clicks "See Profile"
 */
export async function seeProfile(): Promise<void> {
  const token = isIE
    ? await authModule.getProfileTokenRedirect()
    : await authModule.getProfileTokenPopup();
  if (token && token.length > 0) {
    const graphResponse = await networkModule.callEndpointWithToken(
      GRAPH_CONFIG.GRAPH_ME_ENDPT,
      token
    );
    UIManager.updateUI(graphResponse, GRAPH_CONFIG.GRAPH_ME_ENDPT);
  }
}

/**
 * Called when user clicks "Read Mail"
 */
export async function readMail(
  myMSALObj: PublicClientApplication,
  account: AccountInfo
) {
  const token = isIE
    ? await getMailTokenRedirect(myMSALObj, account)
    : await getTokenPopup(myMSALObj, account);

  if (token && token.length > 0) {
    const graphResponse = await callEndpointWithToken<MailInfo>(
      GRAPH_CONFIG.GRAPH_MAIL_ENDPT,
      token
    );
    return graphResponse;

    // UIManager.updateUI(graphResponse, GRAPH_CONFIG.GRAPH_MAIL_ENDPT);
  }
}

export async function revoke(myMSALObj: PublicClientApplication) {
  const currentAccounts = myMSALObj.getAllAccounts();
  const account = currentAccounts[0];

  const accessToken = isIE
    ? await getMailTokenRedirect(myMSALObj, account)
    : await getTokenPopup(myMSALObj, account);

  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  console.log("request made at: " + new Date().toString());

  try {
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/revokeSignInSessions",
      options
    );
    console.log(response);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Called when user clicks "Attempt SsoSilent"
 */
export function attemptSsoSilent(): void {
  authModule.attemptSsoSilent();
}
