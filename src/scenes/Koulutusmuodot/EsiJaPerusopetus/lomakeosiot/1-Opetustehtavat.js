import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { omit } from "ramda";
import { getOpetustehtavaKoodistoFromStorage } from "helpers/opetustehtavat";
import equal from "react-fast-compare";
import common from "i18n/definitions/common";
import esiJaPerusopetus from "i18n/definitions/esiJaPerusopetus";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const constants = {
  mode: "modification",
  formLocation: ["esiJaPerusopetus", "opetusJotaLupaKoskee"]
};

const Opetustehtavat = React.memo(
  ({
    code,
    isPreviewModeOn,
    maaraykset,
    mode = constants.mode,
    rajoitteet,
    sectionId
  }) => {
    const intl = useIntl();
    const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
      anchor: sectionId
    });
    const [opetustehtavakoodisto, setOpetustehtavaKoodisto] = useState();
    const title = intl.formatMessage(common.opetusJotaLupaKoskee);
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
        changeObjects={changeObjects}
        code={code}
        data={{ maaraykset, rajoitteet }}
        formTitle={title}
        mode={mode}
        isPreviewModeOn={isPreviewModeOn}
        isRowExpanded={true}
        path={constants.formLocation}
        rowTitle={intl.formatMessage(esiJaPerusopetus.poOpetustehtava)}
        showCategoryTitles={true}></Lomake>
    ) : null;
  },
  (cp, np) => {
    return equal(omit(["functions"], cp), omit(["functions"], np));
  }
);

Opetustehtavat.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  maaraykset: PropTypes.array,
  mode: PropTypes.string,
  rajoitteet: PropTypes.object,
  sectionId: PropTypes.string
};

export default Opetustehtavat;
