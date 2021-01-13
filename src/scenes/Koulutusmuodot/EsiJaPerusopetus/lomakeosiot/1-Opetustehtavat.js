import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { getOpetustehtavaKoodistoFromStorage } from "helpers/opetustehtavat";
import { getLocalizedProperty } from "../../../../services/lomakkeet/utils";
import common from "../../../../i18n/definitions/common";
import esiJaPerusopetus from "../../../../i18n/definitions/esiJaPerusopetus";

const constants = {
  mode: "modification",
  formLocation: ["esiJaPerusopetus", "opetusJotaLupaKoskee"]
};

const Opetustehtavat = React.memo(
  ({ code, isPreviewModeOn, maaraykset, mode = constants.mode, sectionId }) => {
    const intl = useIntl();
    const [opetustehtavakoodisto, setOpetustehtavaKoodisto] = useState();
    const title = intl.formatMessage(common.opetusJotaLupaKoskee)
    /** Fetch opetustehtavaKoodisto from storage */
    useEffect(() => {
      getOpetustehtavaKoodistoFromStorage()
        .then(opetustehtavaKoodisto => {
          setOpetustehtavaKoodisto(opetustehtavaKoodisto);
        })
        .catch(err => {
          console.error(err);
        });
    }, []);

    return opetustehtavakoodisto ? (
      <Lomake
        anchor={sectionId}
        code={code}
        data={{ maaraykset }}
        formTitle={title}
        mode={mode}
        isPreviewModeOn={isPreviewModeOn}
        isRowExpanded={true}
        path={constants.formLocation}
        rowTitle={intl.formatMessage(esiJaPerusopetus.poOpetustehtava)}
        showCategoryTitles={true}
      ></Lomake>
    ) : null;
  }
);

Opetustehtavat.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  maaraykset: PropTypes.array,
  mode: PropTypes.string,
  sectionId: PropTypes.string
};

export default Opetustehtavat;
