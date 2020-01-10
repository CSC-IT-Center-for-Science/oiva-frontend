import React, { useMemo } from "react";
import { LUPA_EXCEPTION_PATH } from "../../../../modules/constants";
import CurrentLupa from "./CurrentLupa";
import Typography from "@material-ui/core/Typography";
import { LUPA_TEKSTIT } from "../modules/constants";
import { LUPA_LISAKOULUTTAJAT } from "../../constants";
import LupaHistory from "./LupaHistory";
import PropTypes from "prop-types";

const JulkisetTiedot = ({ history, jarjestaja = {}, lupa = {} }) => {
  const lupaException = useMemo(() => {
    return LUPA_LISAKOULUTTAJAT[jarjestaja.ytunnus];
  }, [jarjestaja.ytunnus]);

  const alkupvm = useMemo(() => {
    return lupaException ? lupaException.pvm : lupa.alkupvm;
  }, [lupa, lupaException]);

  return (
    <div className="bg-white p-8">
      <div>
        <Typography component="h1" variant="h5">
          {LUPA_TEKSTIT.PAATOKSET.OTSIKKO.FI}
        </Typography>
        <br />
        <Typography paragraph={true} variant="h6">
          {LUPA_TEKSTIT.PAATOKSET.VIIMEISIN.FI}
        </Typography>
      </div>

      <CurrentLupa
        diaarinumero={lupa.diaarinumero}
        jarjestaja={jarjestaja.nimi}
        voimassaolo={alkupvm}
        lupaExceptionUrl={
          lupaException
            ? `${LUPA_EXCEPTION_PATH}${lupaException.pdflink}`
            : null
        }
      />

      <h3>{LUPA_TEKSTIT.PAATOKSET.HISTORIATIEDOT.FI}</h3>
      <br />

      <LupaHistory history={history} jarjestajaOid={jarjestaja.oid} />
    </div>
  );
};

JulkisetTiedot.propTypes = {
  history: PropTypes.object,
  jarjestaja: PropTypes.object,
  lupa: PropTypes.object
};

export default JulkisetTiedot;
