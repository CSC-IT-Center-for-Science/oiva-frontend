import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useLupahistoria } from "stores/lupahistoria";
import LupapaatoksetTable from "./LupapaatoksetTable";

const Lupapaatokset = ({ koulutusmuoto, jarjestajaOid, tulevatLuvat, voimassaOlevaLupa }) => {
  const [lupahistoria, actions] = useLupahistoria();

  // Let's fetch LUPAHISTORIA
  useEffect(() => {
    if (jarjestajaOid) {
      actions.load(jarjestajaOid, koulutusmuoto, voimassaOlevaLupa ? voimassaOlevaLupa.oppilaitostyyppi : null);
    }
  }, [actions, jarjestajaOid, koulutusmuoto, voimassaOlevaLupa]);

  return lupahistoria.fetchedAt ? (
    <LupapaatoksetTable
      koulutusmuoto={koulutusmuoto}
      data={lupahistoria.data || []}
      tulevatLuvat={tulevatLuvat}
      voimassaOlevaLupa={voimassaOlevaLupa}></LupapaatoksetTable>
  ) : null;
};

Lupapaatokset.propTypes = {
  koulutusmuoto: PropTypes.object,
  jarjestajaOid: PropTypes.string,
  tulevatLuvat: PropTypes.array,
  voimassaOlevaLupa: PropTypes.object
};

export default Lupapaatokset;
