import React from "react";
import PropTypes from "prop-types";
import JarjestamislupaAsiatList from "./JarjestamislupaAsiatList";
import { InnerContentContainer } from "modules/elements";

const JarjestamislupaAsiat = React.memo(
  ({
    history,
    isForceReloadRequested,
    lupa,
    match,
    newApplicationRouteItem,
    organisation
  }) => {
    return (
      <InnerContentContainer>
        <div className="m-8">
          <JarjestamislupaAsiatList
            history={history}
            isForceReloadRequested={isForceReloadRequested}
            lupa={lupa}
            match={match}
            newApplicationRouteItem={newApplicationRouteItem}
            organisation={organisation}
          />
        </div>
      </InnerContentContainer>
    );
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
