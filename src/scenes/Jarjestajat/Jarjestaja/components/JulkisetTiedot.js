import React from "react";
import PropTypes from "prop-types";
import Lupapaatokset from "./Lupapaatokset";

const JulkisetTiedot = ({ history, jarjestaja = {} }) => {
  return (
    <div className="bg-white mt-4 border-solid border border-gray-200">
      <Lupapaatokset history={history} jarjestajaOid={jarjestaja.oid} />
    </div>
  );
};

JulkisetTiedot.propTypes = {
  history: PropTypes.object,
  jarjestaja: PropTypes.object
};

export default JulkisetTiedot;
