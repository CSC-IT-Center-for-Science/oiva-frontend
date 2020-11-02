import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "scenes/AmmatillinenKoulutus/store";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";
import { concat, filter, find, map, path, pathEq } from "ramda";
import Lomake from "components/02-organisms/Lomake";
import { useIntl } from "react-intl";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "laajennettu"]
};

const Laajennettu = React.memo(
  ({ items, localeUpper, maarayksetByKoodiarvo, sectionId }) => {
    const intl = useIntl();

    const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
      anchor: sectionId
    });

    const [, { setLomakedata }] = useLomakedata({ anchor: "muut" });

    const dataLomakepalvelulle = {
      items,
      maarayksetByKoodiarvo
    };

    // useEffect(() => {
    //   console.info(configObj);
    //   const muutostenJalkeenAktiivisetKoodiarvot = filter(koodiarvo => {
    //     const changeObj = find(
    //       pathEq(["properties", "metadata", "koodiarvo"], koodiarvo),
    //       changeObjects
    //     );
    //     return !pathEq(["properties", "isChecked"], false, changeObj);
    //   }, koodiarvotLuvassa).filter(Boolean);

    //   const muutostenMyotaAktiivisetKoodiarvot = map(changeObj => {
    //     return pathEq(["properties", "isChecked"], true, changeObj)
    //       ? path(["properties", "metadata", "koodiarvo"], changeObj)
    //       : null;
    //   }, changeObjects).filter(Boolean);

    //   setLomakedata(
    //     concat(
    //       muutostenJalkeenAktiivisetKoodiarvot,
    //       muutostenMyotaAktiivisetKoodiarvot
    //     ),
    //     `${sectionId}_valitutKoodiarvot`
    //   );
    // }, [changeObjects, koodiarvotLuvassa, sectionId, setLomakedata]);

    //     {
    //       code: "01",
    //       key: "laajennettu",
    //       isInUse: !!dividedArticles["laajennettu"],
    //       title: path(
    //         [0, "metadata", localeUpper, "nimi"],
    //         dividedArticles["laajennettu"]
    //       ),
    //       categoryData: [
    //         {
    //           articles: dividedArticles.laajennettu || [],
    //           componentName: "CheckboxWithLabel"
    //         }
    //       ]
    //     },

    return (
      <Lomake
        action="modification"
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
  opiskelijavuodetData: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Laajennettu;
