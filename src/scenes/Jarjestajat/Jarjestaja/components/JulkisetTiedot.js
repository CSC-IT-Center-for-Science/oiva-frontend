import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { LUPA_EXCEPTION_PATH } from "../../../../modules/constants";
import CurrentLupa from "./CurrentLupa";
import Typography from "@material-ui/core/Typography";
import { LUPA_LISAKOULUTTAJAT } from "../../constants";
import LupaHistory from "./LupaHistory";
import PropTypes from "prop-types";
import common from "../../../../i18n/definitions/common";

const JulkisetTiedot = ({ history, jarjestaja = {}, lupa = {} }) => {
  const intl = useIntl();

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
          {intl.formatMessage(common.lupaPaatokset)}
        </Typography>
        <br />
        <Typography paragraph={true} variant="h6">
          {intl.formatMessage(common.lupaLatest)}
        </Typography>
      </div>

      <CurrentLupa
        diaarinumero={lupa.asianumero ? lupa.asianumero : lupa.diaarinumero}
        uuid={lupa.uuid}
        jarjestaja={jarjestaja.nimi}
        voimassaolo={alkupvm}
        lupaExceptionUrl={
          lupaException
            ? `${LUPA_EXCEPTION_PATH}${lupaException.pdflink}`
            : null
        }
      />

      <h3>{intl.formatMessage(common.lupaHistoria)}</h3>
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
