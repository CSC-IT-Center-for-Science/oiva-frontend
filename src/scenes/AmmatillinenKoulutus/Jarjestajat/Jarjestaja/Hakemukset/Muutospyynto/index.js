import MuutospyyntoContainer from './containers/MuutospyyntoContainer'
import MuutospyyntoWizard from './components/MuutospyyntoWizard'

const routes = [
  {
    path: '/jarjestajat/:ytunnus/hakemukset/uusi',
    exact: true,
    component: MuutospyyntoWizard
  },
  {
    path: '/jarjestajat/:ytunnus/hakemukset-ja-paatokset/:diaarinumero',
    component: MuutospyyntoContainer
  }
]

export default routes
