import AsiatContainer from "./containers/AsiatContainer";
import ValmistelussaAsiatContainer from "./containers/ValmistelussaAsiatContainer";
import PaatetytAsiatContainer from "./containers/PaatetytAsiatContainer";

const routes = [
    {
        path: '/asiat',
        exact: true,
        component: AsiatContainer
    },
    {
        path: '/asiat/valmistelussa-olevat-asiat',
        component: ValmistelussaAsiatContainer
    },
    {
        path: '/asiat/paatetyt-asiat',
        component: PaatetytAsiatContainer
    }

]

export default routes
