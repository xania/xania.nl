/**
 * Graph data about the user.
 */
export type UserInfo = {
  businessPhones?: Array<string>;
  displayName?: string;
  givenName?: string;
  id?: string;
  jobTitle?: string;
  mail?: string;
  mobilePhone?: string;
  officeLocation?: string;
  preferredLanguage?: string;
  surname?: string;
  userPrincipalName?: string;
};

/**
 * Mail data from MS Graph
 */
export type MailInfo = {
  value: Array<Message>;
};

interface Message {
  subject: string;
  sender: {
    emailAddress: { name: string };
  };
}
