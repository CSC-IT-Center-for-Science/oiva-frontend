import React from "react";
import Jarjestajaluettelo from "./Jarjestajaluettelo";
import { Helmet } from "react-helmet";
import education from "../../../i18n/definitions/education";
import { useIntl } from "react-intl";
import BaseData from "basedata";
import vapaaSivistystyo from "i18n/definitions/vapaaSivistystyo";

const keys = ["vstTyypit"];

const JarjestajaluetteloFiltteroinnilla = ({ luvat }) => {
  const intl = useIntl();

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{intl.formatMessage(education.vstEducation)} - Oiva</title>
      </Helmet>

      <BaseData
        locale={intl.locale}
        keys={keys}
        render={_props => (
          <Jarjestajaluettelo
            koulutusmuoto={intl.formatMessage(vapaaSivistystyo.kebabCase)}
            luvat={luvat}
            vstTyypit={_props.vstTyypit}
          />
        )}
      />
    </React.Fragment>
  );
};

export default JarjestajaluetteloFiltteroinnilla;
