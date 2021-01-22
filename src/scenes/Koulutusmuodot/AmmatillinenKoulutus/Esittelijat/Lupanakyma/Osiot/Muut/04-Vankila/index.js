import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/tutkintomuutokset";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "vankila"]
};

const Vankila = ({
  isReadOnly,
  items,
  localeUpper,
  maarayksetByKoodiarvo,
  mode,
  sectionId
}) => {
  const [changeObjects, actions] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });
  const dataLomakepalvelulle = useMemo(
    () => ({
      items,
      maarayksetByKoodiarvo
    }),
    [items, maarayksetByKoodiarvo]
  );

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
};

Vankila.propTypes = {
  koodiarvo: PropTypes.string,
  opiskelijavuodetData: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Vankila;
