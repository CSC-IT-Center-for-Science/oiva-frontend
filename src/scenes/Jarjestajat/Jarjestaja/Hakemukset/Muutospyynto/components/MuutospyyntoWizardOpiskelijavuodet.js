import React, { useEffect, useState } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import common from "../../../../../../i18n/definitions/common";
import PropTypes from "prop-types";
import * as R from "ramda";
import Lomake from "../../../../../../components/02-organisms/Lomake";
import { useChangeObjects } from "../../../../../../stores/changeObjects";
import { useIntl } from "react-intl";

const filterOpiskelijavuodet = (opiskelijavuodet, categoryKey) => {
  const filteredChanges = R.filter(
    R.compose(R.not, R.includes(categoryKey), R.prop("anchor"))
  )(opiskelijavuodet);
  return filteredChanges;
};

// Mikäli jokin näistä koodeista on valittuna osiossa 5, näytetään vaativaa tukea koskevat kentät osiossa 4.
const vaativatCodes = ["2", "16", "17", "18", "19", "20", "21"];

const defaultConstraintFlags = {
  isVaativaTukiVisible: true,
  isSisaoppilaitosVisible: true
};

const MuutospyyntoWizardOpiskelijavuodet = React.memo(props => {
  const intl = useIntl();
  const [changeObjects] = useChangeObjects();
  const { onChangesRemove, onChangesUpdate } = props;
  const { opiskelijavuodet, rajoitukset } = props.lupaKohteet[4];
  const vaativatukiRajoitus = R.find(R.propSatisfies(x => R.includes(x, vaativatCodes), "koodiarvo"), rajoitukset);
  const sisaoppilaitosRajoitus = R.find(R.propSatisfies(x => R.not(R.includes(x, vaativatCodes)), "koodiarvo"), rajoitukset);

  const [constraintFlags, setConstraintFlags] = useState(
    defaultConstraintFlags
  );
  const [applyFor, setApplyFor] = useState(0);
  const [applyForVaativa, setApplyForVaativa] = useState(0);
  const [applyForSisaoppilaitos, setApplyForSisaoppilaitos] = useState(0);
  const [initialValue, setInitialValue] = useState(0);
  const [initialValueVaativa, setInitialValueVaativa] = useState(0);
  const [initialValueSisaoppilaitos, setInitialValueSisaoppilaitos] = useState(
    0
  );
  const [koodiarvot, setKoodiarvot] = useState({});

  useEffect(() => {
    const vuodetValue = R.path([0, "arvo"], opiskelijavuodet) || 0;
    setInitialValue(vuodetValue);
    setApplyFor(vuodetValue);
  }, [opiskelijavuodet]);

  useEffect(() => {
    const sisaoppilaitosValue = R.prop("arvo", sisaoppilaitosRajoitus) || 0;
    const vaativaValue = R.prop("arvo", vaativatukiRajoitus) || 0;
    setInitialValueSisaoppilaitos(sisaoppilaitosValue);
    setApplyForSisaoppilaitos(sisaoppilaitosValue);
    setInitialValueVaativa(vaativaValue);
    setApplyForVaativa(vaativaValue);
  }, [vaativatukiRajoitus, sisaoppilaitosRajoitus]);

  useEffect(() => {
    const maarays = R.find(R.propEq("koodisto", "koulutussektori"))(
      props.maaraykset
    );
    setKoodiarvot(prevState => {
      return {
        ...prevState,
        vahimmaisopiskelijavuodet: {
          koodiarvo: R.prop("koodiarvo", maarays) || "3", // 3 = Ammatillinen koulutus
          maaraysUuid: R.prop("uuid", maarays)
        },
      };
    });
  }, [props.maaraykset, opiskelijavuodet]);

  // This effect is run depending on changes in section 5
  useEffect(() => {
    if (props.muut && props.lomakkeet.muut) {
      let sisaoppilaitosKoodiarvo = null;
      let vaativatKoodiarvo = null;

      const flattenChangesOfMuut = R.flatten(R.values(changeObjects.muut));

      // 03 = Sisäoppilaitosmuotoinen koulutus (section 5)
      const sisaoppilaitosState = R.path(
        ["03", "categories", 0],
        props.lomakkeet.muut
      );

      const newConstraintFlags = {};

      if (sisaoppilaitosState) {
        const isSisaoppilaitosCheckedByDefault = sisaoppilaitosState
          ? sisaoppilaitosState.categories[0].components[0].properties.isChecked
          : false;

        // 5. osion muutosten joukosta etsitään sisäoppilaitosta koskeva muutos.
        const sisaoppilaitosChange = R.find(item => {
          return R.contains("sisaoppilaitos", item.anchor);
        })(flattenChangesOfMuut);

        // Let's pick the koodiarvo up.
        if (sisaoppilaitosChange) {
          sisaoppilaitosKoodiarvo = R.compose(
            R.view(R.lensIndex(2)),
            R.split(".")
          )(sisaoppilaitosChange.anchor);
        } else {
          sisaoppilaitosKoodiarvo = R.head(
            R.map(category => {
              return R.equals(
                true,
                R.path(["properties", "isChecked"], category.components[0])
              )
                ? category.anchor
                : null;
            }, sisaoppilaitosState.categories).filter(Boolean)
          );
        }

        /**
         * Mikäli muutos löytyy ja sisäoppilaitosta koskeva kohta osiossa 5 on valittu, tulee sisäoppilaitosta
         * koskeva tietue näyttää osiossa 4.
         */

        const isCheckedByDefault =
          isSisaoppilaitosCheckedByDefault && !sisaoppilaitosChange;
        const isCheckedByChange =
          !!sisaoppilaitosChange && sisaoppilaitosChange.properties.isChecked;

        const shouldSisaoppilaitosBeVisible =
          isCheckedByDefault || isCheckedByChange;

        newConstraintFlags.isSisaoppilaitosVisible = shouldSisaoppilaitosBeVisible;
      }

      // 02 = Vaativa tuki, 0 includes a list of radio buttons
      const vaativatukiState = R.path(
        ["02", "categories", 0],
        props.lomakkeet.muut
      );

      /**
       * Seuraavaksi etsitään ne vaativaa tukea koskevat - osioon 5 tehdyt - muutokset, jotka vaikuttavat
       * vaativaa tukea käsittelevän tietueen näkyvyyteen osiossa 4.
       */
      const vaativatChanges = R.filter(item => {
        const anchorParts = R.split(".", item.anchor);
        return (
          R.contains("vaativatuki", item.anchor) &&
          R.contains(""+parseInt(R.slice(2, 3)(anchorParts), 10), vaativatCodes)
        );
      })(flattenChangesOfMuut);

      if (vaativatukiState) {
        // Let's find out the koodiarvo for vaativa tuki.
        if (vaativatChanges.length) {
          vaativatKoodiarvo = R.compose(
            R.view(R.lensIndex(2)),
            R.split(".")
          )(vaativatChanges[0].anchor);
        } else {
          vaativatKoodiarvo = R.head(
            R.map(category => {
              return R.equals(
                true,
                R.path(["properties", "isChecked"], category.components[0])
              )
                ? category.anchor
                : null;
            }, vaativatukiState.categories).filter(Boolean)
          );
        }

        const isVaativatukiCheckedByDefault = R.find(category => {
          // 23 = Ei velvollisuutta järjestää tutkintoja ja valmentavaa
          // koulutusta vaativaan erityiseen tukeen oikeutetuille opiskelijoille
          return (
            category.anchor !== "23" &&
            category.components[0].properties.isChecked
          );
        }, vaativatukiState.categories);

        const isCheckedByChange = !!R.filter(
          R.compose(R.equals(true), R.path(["properties", "isChecked"]))
        )(vaativatChanges).length;

        const shouldVaativatBeVisible =
          isVaativatukiCheckedByDefault || isCheckedByChange;

        newConstraintFlags.isVaativaTukiVisible = shouldVaativatBeVisible;
      }

      setConstraintFlags(previousConstraintFlags => {
        return {
          ...previousConstraintFlags,
          ...newConstraintFlags
        };
      });

      // Let's set koodiarvot so that they can be used when saving the muutoshakemus.
      setKoodiarvot(prevState => {
        return {
          ...prevState,
          sisaoppilaitos: {
            koodiarvo: sisaoppilaitosKoodiarvo,
            maaraysUuid: R.prop("maaraysUuid", sisaoppilaitosRajoitus)
          },
          vaativatuki: {
            koodiarvo: vaativatKoodiarvo,
            maaraysUuid: R.prop("maaraysUuid", vaativatukiRajoitus)
          }
        };
      });
    }
  }, [changeObjects.muut, props.muut, props.lomakkeet.muut, sisaoppilaitosRajoitus, vaativatukiRajoitus]);

  // When sisaoppilaitos or vaativatuki are not visible, exclude them from the collection of changes updates
  useEffect(() => {
    let filteredChanges = changeObjects.opiskelijavuodet;
    if (
      !constraintFlags.isSisaoppilaitosVisible &&
      changeObjects.opiskelijavuodet
    ) {
      filteredChanges = filterOpiskelijavuodet(
        filteredChanges,
        "sisaoppilaitos"
      );
    }
    if (
      !constraintFlags.isVaativaTukiVisible &&
      changeObjects.opiskelijavuodet
    ) {
      filteredChanges = filterOpiskelijavuodet(filteredChanges, "vaativatuki");
    }

    if (!R.equals(filteredChanges, changeObjects.opiskelijavuodet)) {
      onChangesUpdate({
        anchor: props.sectionId,
        changes: filteredChanges
      });
    }
  }, [
    constraintFlags,
    onChangesUpdate,
    changeObjects.opiskelijavuodet,
    props.sectionId
  ]);

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  return (
    <ExpandableRowRoot
      anchor={props.sectionId}
      key={`expandable-row-root`}
      categories={[]}
      changes={changeObjects.opiskelijavuodet}
      hideAmountOfChanges={true}
      messages={changesMessages}
      onChangesRemove={onChangesRemove}
      onUpdate={onChangesUpdate}
      sectionId={props.sectionId}
      showCategoryTitles={true}
      isExpanded={true}>
      <Lomake
        action="modification"
        anchor={props.sectionId}
        changeObjects={changeObjects.opiskelijavuodet}
        data={{
          applyFor,
          applyForSisaoppilaitos,
          applyForVaativa,
          initialValue,
          initialValueSisaoppilaitos,
          initialValueVaativa,
          isVaativaTukiVisible: constraintFlags.isVaativaTukiVisible,
          isSisaoppilaitosVisible: constraintFlags.isSisaoppilaitosVisible,
          isSisaoppilaitosValueRequired: false,
          isVaativaTukiValueRequired: false,
          koodiarvot,
          sectionId: props.sectionId
        }}
        onChangesUpdate={onChangesUpdate}
        path={["opiskelijavuodet"]}
        rules={[]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
});

MuutospyyntoWizardOpiskelijavuodet.defaultProps = {
  maaraykset: []
};

MuutospyyntoWizardOpiskelijavuodet.propTypes = {
  lomakkeet: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maaraykset: PropTypes.array,
  muut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func
};

export default MuutospyyntoWizardOpiskelijavuodet;
