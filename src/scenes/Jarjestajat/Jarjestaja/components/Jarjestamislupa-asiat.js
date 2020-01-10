import React from "react";
import PropTypes from "prop-types";
import JarjestamislupaAsiatList from "./JarjestamislupaAsiatList";
import { InnerContentContainer } from "../../../../modules/elements";

const JarjestamislupaAsiat = React.memo(
  ({ history, match, newApplicationRouteItem }) => {
    return (
      <InnerContentContainer>
        <div className="m-8">
          <JarjestamislupaAsiatList
            history={history}
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
  match: PropTypes.object,
  newApplicationRouteItem: PropTypes.object
};

export default JarjestamislupaAsiat;
