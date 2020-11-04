import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";

const constants = {
  formLocation: ["esiJaPerusopetus", "opetuskielet"]
}

const Opetuskieli = ({
  ensisijaisetOpetuskieletOPH,
  lisatiedot,
  sectionId,
  toissijaisetOpetuskieletOPH
}) => {
  const intl = useIntl();
  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      data={{
        ensisijaisetOpetuskieletOPH,
        lisatiedot,
        toissijaisetOpetuskieletOPH
      }}
      path={constants.formLocation}
      showCategoryTitles={true}
      rowTitle={intl.formatMessage(common.kielet)}></Lomake>
  )
};

Opetuskieli.defaultProps = {
  lisatiedot: [],
  ensisijaisetOpetuskieletOPH: [],
  toissijaisetOpetuskieletOPH: []
};

Opetuskieli.propTypes = {
  lisatiedot: PropTypes.array,
  ensisijaisetOpetuskieletOPH: PropTypes.array,
  toissijaisetOpetuskieletOPH: PropTypes.array
};

export default Opetuskieli;
