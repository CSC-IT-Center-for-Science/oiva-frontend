import React from "react";
import PropTypes from "prop-types";
import Lupapaatokset from "./Lupapaatokset";

const JulkisetTiedot = ({ jarjestaja = {} }) => {
  return (
    <div className="bg-white mt-4 border-solid border border-gray-200">
      <Lupapaatokset jarjestajaOid={jarjestaja.oid} />
    </div>
  );
};

JulkisetTiedot.propTypes = {
  jarjestaja: PropTypes.object
};

export default JulkisetTiedot;
