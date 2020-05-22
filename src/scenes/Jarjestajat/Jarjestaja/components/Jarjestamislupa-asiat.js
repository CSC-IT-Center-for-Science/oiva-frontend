import React from "react";
import PropTypes from "prop-types";
import JarjestamislupaAsiatList from "./JarjestamislupaAsiatList";
import { InnerContentContainer } from "../../../../modules/elements";

const JarjestamislupaAsiat = React.memo(
  ({ history, isForceReloadRequested, match, newApplicationRouteItem }) => {
    return (
      <InnerContentContainer>
        <div className="m-8">
          <JarjestamislupaAsiatList
            history={history}
            isForceReloadRequested={isForceReloadRequested}
            match={match}
            newApplicationRouteItem={newApplicationRouteItem}
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
  newApplicationRouteItem: PropTypes.object
};

export default JarjestamislupaAsiat;
