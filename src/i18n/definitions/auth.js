import { defineMessages } from "react-intl";

export default defineMessages({
  logIn: {
    id: "auth.logIn",
    defaultMessage: "Kirjaudu sisään"
  },
  logOut: {
    id: "auth.logOut",
    defaultMessage: "Kirjaudu ulos"
  },
  loggedInInfo: {
    id: "auth.loggedInInfo",
    defaultMessage: "Olet kirjautunut sisään"
  },
  sessionDialogTitle: {
    id: "auth.sessionDialogTitle",
    defaultMessage: "Kirjautumisesi on vanhentumassa"
  },
  sessionDialogCountdown: {
    id: "auth.sessionDialogCountdown",
    defaultMessage:
      "Kirjautumisesi vanhenee {time} jälkeen. Jatketaanko kirjautuneena?"
  },
  jatkaKirjautuneena: {
    id: "auth.jatkaKirjautuneena",
    defaultMessage: "Jatka kirjautuneena"
  },
  sessionTimeoutTitle: {
    id: "auth.sessionTimeoutTitle",
    defaultMessage: "Kirjautumisesi on vanhentunut"
  },
  sessionTimeoutInfo: {
    id: "auth.sessionTimeoutInfo",
    defaultMessage:
      "Sinut on kirjattu turvallisuussyistä automaattisesti ulos {time} minuutin toimettomuuden vuoksi."
  },
  endOfSessionTitle: {
    id: "auth.endOfSessionTitle",
    defaultMessage: "Olet kirjautunut ulos"
  },
  endOfSessionInfo: {
    id: "auth.endOfSessionInfo",
    defaultMessage: "Sinut on kirjattu ulos sovelluksesta."
  }
});
