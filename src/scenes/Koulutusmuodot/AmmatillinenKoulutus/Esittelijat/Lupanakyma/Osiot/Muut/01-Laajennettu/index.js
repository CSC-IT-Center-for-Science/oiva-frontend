import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const constants = {
  formLocation: [
    "ammatillinenKoulutus",
    "muut",
    "laajennettuOppisopimuskoulutus"
  ]
};

const Laajennettu = React.memo(
  ({
    isReadOnly,
    items,
    localeUpper,
    maarayksetByKoodiarvo,
    mode,
    sectionId
  }) => {
    const dataLomakepalvelulle = {
      items,
      maarayksetByKoodiarvo
    };

    const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
      anchor: sectionId
    });

    return (
      <Lomake
        anchor={sectionId}
        changeObjects={changeObjects}
        data={dataLomakepalvelulle}
        isReadOnly={isReadOnly}
        mode={mode}
        path={constants.formLocation}
        rowTitle={items[0].metadata[localeUpper].nimi}
        showCategoryTitles={true}
      />
    );
  }
);

Laajennettu.propTypes = {
  isReadOnly: PropTypes.bool,
  items: PropTypes.array,
  koodiarvo: PropTypes.string,
  localeUpper: PropTypes.string,
  maarayksetByKoodiarvo: PropTypes.string,
  mode: PropTypes.string,
  opiskelijavuodetData: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Laajennettu;
