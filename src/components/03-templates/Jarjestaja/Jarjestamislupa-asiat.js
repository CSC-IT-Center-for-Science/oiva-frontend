import React from "react";
import PropTypes from "prop-types";
import JarjestamislupaAsiatList from "./JarjestamislupaAsiatList";
import equal from "react-fast-compare";

const JarjestamislupaAsiat = React.memo(
  ({
    history,
    isForceReloadRequested,
    koulutusmuoto,
    lupa,
    match,
    newApplicationRouteItem,
    organisation
  }) => {
    return (
      <JarjestamislupaAsiatList
        history={history}
        isForceReloadRequested={isForceReloadRequested}
        koulutusmuoto={koulutusmuoto}
        lupa={lupa}
        match={match}
        newApplicationRouteItem={newApplicationRouteItem}
        organisation={organisation}
      />
    );
  },
  (cp, np) => {
    return equal(cp, np);
  }
);

JarjestamislupaAsiat.propTypes = {
  history: PropTypes.object,
  isForceReloadRequested: PropTypes.bool,
  match: PropTypes.object,
  newApplicationRouteItem: PropTypes.object,
  organisation: PropTypes.object
};

export default JarjestamislupaAsiat;
