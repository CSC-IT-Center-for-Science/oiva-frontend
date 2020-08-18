import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useLupahistoria } from "../../../../stores/lupahistoria";
import LupapaatoksetTable from "./LupapaatoksetTable";

const Lupapaatokset = ({ jarjestajaOid }) => {
  const [lupahistoria, actions] = useLupahistoria();

  // Let's fetch LUPAHISTORIA
  useEffect(() => {
    if (jarjestajaOid) {
      actions.load(jarjestajaOid);
    }
  }, [actions, jarjestajaOid]);

  console.info(lupahistoria);

  return lupahistoria.data ? (
    <LupapaatoksetTable data={lupahistoria.data}></LupapaatoksetTable>
  ) : null;
};

Lupapaatokset.propTypes = {
  jarjestajaOid: PropTypes.string
};

export default Lupapaatokset;
