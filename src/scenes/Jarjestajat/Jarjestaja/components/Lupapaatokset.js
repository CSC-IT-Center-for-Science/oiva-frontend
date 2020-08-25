import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useLupahistoria } from "../../../../stores/lupahistoria";
import LupapaatoksetTable from "./LupapaatoksetTable";

const Lupapaatokset = ({ jarjestajaOid, lupa }) => {
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
      lupa={lupa}></LupapaatoksetTable>
  ) : null;
};

Lupapaatokset.propTypes = {
  jarjestajaOid: PropTypes.string,
  lupa: PropTypes.object
};

export default Lupapaatokset;
