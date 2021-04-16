import MuutospyyntoContainer from "./containers/MuutospyyntoContainer";
import MuutospyyntoWizard from "./components/MuutospyyntoWizard";

const routes = [
  {
    path: "/jarjestajat/:id/hakemukset/uusi/:page/:language",
    exact: true,
    component: MuutospyyntoWizard
  },
  {
    path: "/jarjestajat/:id/hakemukset-ja-paatokset/:diaarinumero",
    component: MuutospyyntoContainer
  }
];

export default routes;
