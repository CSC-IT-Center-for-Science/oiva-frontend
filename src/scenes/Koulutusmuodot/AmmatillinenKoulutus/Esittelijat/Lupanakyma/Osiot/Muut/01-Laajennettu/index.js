import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";

const constants = {
  formLocation: [
    "ammatillinenKoulutus",
    "muut",
    "laajennettuOppisopimuskoulutus"
  ]
};

const Laajennettu = React.memo(
  ({ items, localeUpper, maarayksetByKoodiarvo, mode, sectionId }) => {
    const dataLomakepalvelulle = {
      items,
      maarayksetByKoodiarvo
    };

    return (
      <Lomake
        mode={mode}
        anchor={sectionId}
        data={dataLomakepalvelulle}
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
