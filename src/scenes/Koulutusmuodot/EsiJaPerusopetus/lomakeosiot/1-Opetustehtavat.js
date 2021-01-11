import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { omit, path, prop, toUpper } from "ramda";
import { getOpetustehtavaKoodistoFromStorage } from "helpers/opetustehtavat";
import equal from "react-fast-compare";
import { getLocalizedProperty } from "../../../../services/lomakkeet/utils";

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
    const [opetustehtavakoodisto, setOpetustehtavaKoodisto] = useState();
    const title = opetustehtavakoodisto ? getLocalizedProperty(opetustehtavakoodisto.metadata, intl.locale, "kuvaus") : "";

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
        data={{ maaraykset, rajoitteet }}
        formTitle={title}
        mode={mode}
        isPreviewModeOn={isPreviewModeOn}
        isRowExpanded={true}
        path={constants.formLocation}
        rowTitle={getLocalizedProperty(opetustehtavakoodisto.metadata, intl.locale, "nimi")}
        showCategoryTitles={true}
      ></Lomake>
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
