import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../../components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "scenes/AmmatillinenKoulutus/store";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";
import { getAktiivisetTutkinnot } from "../../../../../../../../helpers/tutkinnot";

const constants = {
  formLocation: ["tutkinnot"]
};

const Koulutusala = ({ data, sectionId, title, tutkinnot }) => {
  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const [, { setLomakedata }] = useLomakedata({ anchor: sectionId });

  useEffect(() => {
    const aktiivisetTutkinnot = getAktiivisetTutkinnot(
      tutkinnot,
      changeObjects
    );
    setLomakedata(aktiivisetTutkinnot, `${sectionId}_aktiiviset`);
  }, [changeObjects, sectionId, setLomakedata, tutkinnot]);

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      data={data}
      key={sectionId}
      path={constants.formLocation}
      rowTitle={title}
      showCategoryTitles={true}
    />
  );
};

Koulutusala.propTypes = {
  data: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string,
  tutkinnot: PropTypes.array
};

export default Koulutusala;
