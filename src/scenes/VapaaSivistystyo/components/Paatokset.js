import React from "react";
import { useIntl } from "react-intl";
import CurrentLupa from "./CurrentLupa";
import Typography from "@material-ui/core/Typography";
import LupaHistory from "./LupaHistory";
import PropTypes from "prop-types";
import common from "../../../i18n/definitions/common";

const Paatokset = ({ history, jarjestaja = {}, lupa = {} }) => {
  const intl = useIntl();

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
        filename={lupa.meta.liitetiedosto}
        diaarinumero={lupa.diaarinumero}
        jarjestaja={jarjestaja.nimi}
        voimassaolo={lupa.alkupvm}
      />

      <h3>{intl.formatMessage(common.lupaHistoria)}</h3>
      <br />

      <LupaHistory history={history} jarjestajaOid={jarjestaja.oid} />
    </div>
  );
};

Paatokset.propTypes = {
  history: PropTypes.object,
  jarjestaja: PropTypes.object,
  lupa: PropTypes.object
};

export default Paatokset;
