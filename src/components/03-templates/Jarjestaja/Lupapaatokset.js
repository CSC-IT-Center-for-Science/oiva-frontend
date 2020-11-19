import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useLupahistoria } from "stores/lupahistoria";
import LupapaatoksetTable from "./LupapaatoksetTable";

const Lupapaatokset = ({ jarjestajaOid, tulevatLuvat, voimassaOlevaLupa }) => {
  const [lupahistoria, actions] = useLupahistoria();

  // Let's fetch LUPAHISTORIA
  useEffect(() => {
    if (jarjestajaOid) {
      actions.load(jarjestajaOid);
    }
  }, [actions, jarjestajaOid]);

  return lupahistoria.data ? (
    <LupapaatoksetTable
      data={lupahistoria.data}
      tulevatLuvat={tulevatLuvat}
      voimassaOlevaLupa={voimassaOlevaLupa}></LupapaatoksetTable>
  ) : null;
};

Lupapaatokset.propTypes = {
  jarjestajaOid: PropTypes.string,
  tulevatLuvat: PropTypes.array,
  voimassaOlevaLupa: PropTypes.object
};

export default Lupapaatokset;
