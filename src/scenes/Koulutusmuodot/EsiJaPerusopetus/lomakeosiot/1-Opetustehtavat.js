import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { path, prop, toUpper } from "ramda";
import { getOpetustehtavaKoodistoFromStorage } from "helpers/opetustehtavat";

const constants = {
  mode: "modification",
  formLocation: ["esiJaPerusopetus", "opetusJotaLupaKoskee"]
};

const Opetustehtavat = React.memo(
  ({ code, isPreviewModeOn, maaraykset, mode = constants.mode, sectionId }) => {
    const intl = useIntl();
    const [opetustehtavakoodisto, setOpetustehtavaKoodisto] = useState();
    const title = prop(
      "kuvaus",
      path(["metadata", toUpper(intl.locale)], opetustehtavakoodisto)
    );

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
        rowTitle={opetustehtavakoodisto.metadata[toUpper(intl.locale)].nimi}
        showCategoryTitles={true}></Lomake>
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
