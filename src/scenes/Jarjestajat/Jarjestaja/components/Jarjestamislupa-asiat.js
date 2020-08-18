import React from "react";
import PropTypes from "prop-types";
import JarjestamislupaAsiatList from "./JarjestamislupaAsiatList";
import { InnerContentContainer } from "../../../../modules/elements";

const JarjestamislupaAsiat = props => {
  console.info(props);
  return (
    <InnerContentContainer>
      <div className="m-8">
        <JarjestamislupaAsiatList
          isForceReloadRequested={props.isForceReloadRequested}
          newApplicationRouteItem={props.newApplicationRouteItem}
          lupa={props.lupa}
        />
      </div>
    </InnerContentContainer>
  );
};

JarjestamislupaAsiat.propTypes = {
  isForceReloadRequested: PropTypes.bool,
  newApplicationRouteItem: PropTypes.object
};

export default JarjestamislupaAsiat;
