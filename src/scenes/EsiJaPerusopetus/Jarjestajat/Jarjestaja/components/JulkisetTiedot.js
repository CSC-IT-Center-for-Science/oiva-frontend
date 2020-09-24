import React from "react";
import PropTypes from "prop-types";
import Lupapaatokset from "./Lupapaatokset";

const JulkisetTiedot = ({ jarjestaja, lupa }) => {
  return (
    <div className="bg-white border-solid border border-gray-200">
      <Lupapaatokset jarjestajaOid={jarjestaja.oid} lupa={lupa} />
    </div>
  );
};

JulkisetTiedot.propTypes = {
  history: PropTypes.object,
  jarjestaja: PropTypes.object,
  lupa: PropTypes.object
};

export default JulkisetTiedot;
