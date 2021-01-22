import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/tutkintomuutokset";

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

    const [
      changeObjects,
      actions
    ] = useChangeObjectsByAnchorWithoutUnderRemoval({
      anchor: sectionId
    });

    return (
      <Lomake
        actions={actions}
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
  koodiarvo: PropTypes.string,
  mode: PropTypes.string,
  opiskelijavuodetData: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Laajennettu;
