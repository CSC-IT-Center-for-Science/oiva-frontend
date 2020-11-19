import React from "react";
import PropTypes from "prop-types";
import Lupapaatokset from "./Lupapaatokset";

const JulkisetTiedot = ({ jarjestaja, tulevatLuvat, voimassaOlevaLupa }) => {
  return (
    <div className="bg-white border-solid border border-gray-200 my-12 mx-auto w-4/5">
      <Lupapaatokset jarjestajaOid={jarjestaja.oid} tulevatLuvat={tulevatLuvat} voimassaOlevaLupa={voimassaOlevaLupa} />
    </div>
  );
};

JulkisetTiedot.propTypes = {
  jarjestaja: PropTypes.object,
  tulevatLuvat: PropTypes.array,
  voimassaOlevaLupa: PropTypes.object
};

export default JulkisetTiedot;
