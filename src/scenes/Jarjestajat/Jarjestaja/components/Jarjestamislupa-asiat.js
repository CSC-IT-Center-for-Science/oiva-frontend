import React from "react";
import JarjestamislupaAsiatList from "./JarjestamislupaAsiatList";
import { InnerContentContainer } from "../../../../modules/elements";
import PropTypes from "prop-types";

const JarjestamislupaAsiat = ({
  match,
  muutospyynnot,
  newApplicationRouteItem,
  organisaatio,
  intl
}) => {
  return (
    <InnerContentContainer>
      <div className="m-8">
        <JarjestamislupaAsiatList
          match={match}
          intl={intl}
          muutospyynnot={muutospyynnot}
          newApplicationRouteItem={newApplicationRouteItem}
          organisaatio={organisaatio}
        />
      </div>
    </InnerContentContainer>
  );
};

JarjestamislupaAsiat.propTypes = {
  match: PropTypes.object,
  muutospyynnot: PropTypes.array,
  newApplicationRouteItem: PropTypes.object
};

export default JarjestamislupaAsiat;
