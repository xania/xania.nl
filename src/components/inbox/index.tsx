import { List, useState } from "xania";
import { Link, Route } from "xania/router";
import { Page } from "~/layout/page";
// import * as oauth2 from "oauth4webapi";
import { readMail, revoke, signIn, signOut } from "~/services/microsoft";

import { createApp, getAccount } from "~/services/microsoft/mail";

export async function InboxApp() {
  const app = createApp();
  const account = useState(getAccount(app));
  const email = account.map((account) =>
    readMail(app, account).then((e) => e?.value)
  );

  return (
    <>
      <Page>
        <button
          class="m-2 bg-slate-500 px-2 text-white"
          click={(e) => signIn()}
        >
          sign in
        </button>
        <button
          class="m-2 bg-red-500 px-2 text-white"
          click={(e) => signOut(app)}
        >
          sign out
        </button>
        <div>
          <table class="border-separate border-spacing-y-2 border-slate-400">
            <tr>
              <td class="p-2 pl-4">From</td>
              <td class="p-2 pl-4">Subject</td>
            </tr>
            <List source={email}>
              {(row) => (
                <>
                  <tr class="align-text-top hover:bg-gray-200">
                    <td class="border-l-4 border-solid border-blue-900 p-2  pl-4 ">
                      <a>
                        {row.map((e) => e.sender.emailAddress.name)}
                        <Link to="message" />
                      </a>
                    </td>
                    <td class="p-2 pl-4">
                      <a href="/inbox/message">{row.prop("subject")}</a>
                    </td>
                  </tr>
                </>
              )}
            </List>
          </table>
        </div>
      </Page>
      <Route path="message">
        <Page>message</Page>
      </Route>
    </>
  );
}
