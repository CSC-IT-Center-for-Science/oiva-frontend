import React, { useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import ExpandableRowRoot from "../../../../../../components/02-organisms/ExpandableRowRoot";
import {
  getAnchorPart,
  replaceAnchorPartWith,
  removeAnchorPart
} from "../../../../../../utils/common";
import Lomake from "../../../../../../components/02-organisms/Lomake";
import * as R from "ramda";

const MuutospyyntoWizardToimintaalue = React.memo(props => {
  const intl = useIntl();
  const { onChangesUpdate } = props;

  const lisattavatKunnat = useMemo(() => {
    return R.sortBy(
      R.prop("title"),
      R.map(changeObj => {
        return R.equals(
          getAnchorPart(changeObj.anchor, 2),
          "lupaan-lisattavat-kunnat"
        )
          ? changeObj.properties
          : null;
      }, props.changeObjects.muutokset || []).filter(Boolean)
    );
  }, [props.changeObjects.muutokset]);

  const lisattavatMaakunnat = useMemo(() => {
    return R.sortBy(
      R.prop("title"),
      R.map(changeObj => {
        return R.equals(
          getAnchorPart(changeObj.anchor, 2),
          "lupaan-lisattavat-maakunnat"
        )
          ? changeObj.properties
          : null;
      }, props.changeObjects.muutokset || []).filter(Boolean)
    );
  }, [props.changeObjects.muutokset]);

  const kunnatInLupa = useMemo(() => {
    return R.sortBy(
      R.path(["metadata", "arvo"]),
      R.map(kunta => {
        return {
          title: kunta.arvo,
          metadata: kunta
        };
      }, props.lupakohde.kunnat)
    );
  }, [props.lupakohde.kunnat]);

  const maakunnatInLupa = useMemo(() => {
    return R.sortBy(
      R.path(["metadata", "arvo"]),
      R.map(maakunta => {
        return {
          title: maakunta.arvo,
          metadata: maakunta
        };
      }, props.lupakohde.maakunnat)
    );
  }, [props.lupakohde.maakunnat]);

  const valittavissaOlevatKunnat = useMemo(() => {
    return R.sortBy(
      R.prop("label"),
      R.map(kunta => {
        const labelObject = R.find(R.propEq("kieli", R.toUpper(intl.locale)))(
          kunta.metadata
        );
        const isKuntaInLupa = !!R.find(
          R.pathEq(["metadata", "koodiarvo"], kunta.koodiArvo),
          kunnatInLupa
        );
        const isKuntaInLisattavat = !!R.find(
          R.pathEq(["metadata", "koodiarvo"], kunta.koodiArvo),
          lisattavatKunnat
        );
        return isKuntaInLupa || isKuntaInLisattavat
          ? null
          : {
              label: labelObject.nimi,
              value: kunta.koodiArvo,
              metadata: {
                koodiarvo: kunta.koodiArvo,
                koodisto: kunta.koodisto,
                label: labelObject.nimi
              }
            };
      }, props.kunnat).filter(Boolean)
    );
  }, [kunnatInLupa, lisattavatKunnat, intl.locale, props.kunnat]);

  const valittavissaOlevatMaakunnat = useMemo(() => {
    return R.sortBy(
      R.prop("label"),
      R.map(maakunta => {
        const labelObject = R.find(R.propEq("kieli", R.toUpper(intl.locale)))(
          maakunta.metadata
        );
        const isMaakuntaInLupa = !!R.find(
          R.pathEq(["metadata", "koodiarvo"], maakunta.koodiArvo),
          maakunnatInLupa
        );
        const isMaakuntaInLisattavat = !!R.find(
          R.pathEq(["metadata", "koodiarvo"], maakunta.koodiArvo),
          lisattavatMaakunnat
        );
        return isMaakuntaInLupa || isMaakuntaInLisattavat
          ? null
          : {
              label: labelObject.nimi,
              value: maakunta.koodiArvo,
              metadata: {
                koodiarvo: maakunta.koodiArvo,
                koodisto: maakunta.koodisto,
                label: labelObject.nimi
              }
            };
      }, props.maakunnat).filter(Boolean)
    );
  }, [lisattavatMaakunnat, maakunnatInLupa, intl.locale, props.maakunnat]);

  const isValtakunnallinenChecked = useMemo(() => {
    const valtakunnallinenChangeObject = R.find(changeObj => {
      return R.equals(getAnchorPart(changeObj.anchor, 1), "valtakunnallinen");
    }, props.changeObjects.muutokset || []);
    return (
      (props.lupakohde.valtakunnallinen &&
        props.lupakohde.valtakunnallinen.arvo === "FI1" &&
        !valtakunnallinenChangeObject) ||
      (valtakunnallinenChangeObject &&
        valtakunnallinenChangeObject.properties.isChecked)
    );
  }, [props.changeObjects.muutokset, props.lupakohde.valtakunnallinen]);

  const isEiMaariteltyaToimintaaluettaChecked = useMemo(() => {
    const changeObject = R.find(changeObj => {
      return R.equals(
        getAnchorPart(changeObj.anchor, 1),
        "ei-maariteltya-toiminta-aluetta"
      );
    }, props.changeObjects.muutokset || []);
    return changeObject && changeObject.properties.isChecked;
  }, [props.changeObjects.muutokset]);

  /**
   * There are three radio buttons in Toiminta-alue section: 1) Maakunnat and kunnat
   * 2) Koko Suomi - pois lukien Ahvenanmaan maakunta 3) Ei määriteltyä toiminta-aluetta.
   * When one of them is selected the change objects under other ones have to be deleted.
   * This function deletes them.
   */
  useEffect(() => {
    if (isEiMaariteltyaToimintaaluettaChecked || isValtakunnallinenChecked) {
      // Let's check if updating is necessary.
      const radioButtonChangeObjects = R.filter(
        R.compose(R.includes("radio"), R.prop("anchor")),
        props.changeObjects.muutokset || []
      );
      if (!R.equals(radioButtonChangeObjects, props.changeObjects.muutokset)) {
        // Fist we are going to update the change objects of Toiminta-alue section
        // on form page one.
        onChangesUpdate({
          anchor: props.sectionId,
          changes: radioButtonChangeObjects
        });
        // Then it's time to get rid of the change objects of form page two (reasoning).
        onChangesUpdate({
          anchor: `perustelut_${props.sectionId}`,
          changes: []
        });
      }
    }
  }, [
    isEiMaariteltyaToimintaaluettaChecked,
    isValtakunnallinenChecked,
    onChangesUpdate,
    props.changeObjects.muutokset,
    props.sectionId
  ]);

  /**
   * Changes are handled here. Changes objects will be formed and callback
   * function will be called with them.
   */
  const handleChanges = useCallback(
    changesByAnchor => {
      const updatedChanges = R.map(changeObj => {
        let changeObjectsForKunnatInLupa = [];
        const metadata =
          R.path(["properties", "value", "metadata"], changeObj) ||
          R.path(["properties", "metadata"], changeObj);
        const koodistoUri = R.path(["koodisto", "koodistoUri"], metadata);
        const isMaakunta = koodistoUri && koodistoUri === "maakunta";
        if (isMaakunta) {
          const relatedKunnatParentObject = R.find(
            R.propEq("koodiArvo", metadata.koodiarvo),
            props.maakuntakunnatList
          );
          const kunnat = relatedKunnatParentObject
            ? relatedKunnatParentObject.kunta
            : [];
          changeObjectsForKunnatInLupa = R.map(kunta => {
            const kuntaInLupa = R.find(
              R.pathEq(["metadata", "koodiarvo"], kunta.koodiArvo),
              kunnatInLupa
            );
            const kuntaChangeObj = R.find(
              R.propEq(
                "anchor",
                `toimintaalue.maakunnat-ja-kunnat.lupaan-kuuluvat-kunnat.${kunta.koodiArvo}`
              ),
              props.changeObjects.muutokset || []
            );
            const isKuntaAlreadyUnchecked =
              kuntaChangeObj && kuntaChangeObj.properties.isChecked === false;

            return !!kuntaInLupa && !isKuntaAlreadyUnchecked
              ? {
                  anchor: `toimintaalue.maakunnat-ja-kunnat.lupaan-kuuluvat-kunnat.${kunta.koodiArvo}`,
                  properties: {
                    ...kuntaInLupa.properties,
                    isChecked: false,
                    metadata: {
                      title: kuntaInLupa.title,
                      koodiarvo: kunta.koodiArvo,
                      koodisto: { koodistoUri: kunta.koodisto }
                    }
                  }
                }
              : null;
          }, kunnat).filter(Boolean);
        }

        if (
          // Let's remove all the change objects which are not checked and which are not in LUPA
          R.includes("lupaan-lisattavat", changeObj.anchor) &&
          changeObj.properties.isChecked === false
        ) {
          return null;
        } else if (R.includes("valintakentta", changeObj.anchor)) {
          // Let's return a new change object based on the one user selected using select element
          let updatedAnchor = removeAnchorPart(changeObj.anchor, 2);

          updatedAnchor = replaceAnchorPartWith(
            updatedAnchor,
            1,
            "maakunnat-ja-kunnat.lupaan-lisattavat-" +
              getAnchorPart(updatedAnchor, 2)
          );
          updatedAnchor = replaceAnchorPartWith(
            updatedAnchor,
            3,
            changeObj.properties.value.value
          );

          return [
            {
              anchor: updatedAnchor,
              properties: {
                isChecked: true,
                metadata: changeObj.properties.value.metadata,
                title: changeObj.properties.value.label
              }
            },
            changeObjectsForKunnatInLupa
          ];
        }
        return [changeObj, changeObjectsForKunnatInLupa];
      }, changesByAnchor.changes).filter(Boolean);

      const sectionChanges = {
        anchor: changesByAnchor.anchor,
        changes: R.uniq(R.flatten(updatedChanges))
      };
      onChangesUpdate(sectionChanges);
    },
    [
      onChangesUpdate,
      kunnatInLupa,
      props.changeObjects.muutokset,
      props.maakuntakunnatList
    ]
  );

  return (
    <ExpandableRowRoot
      anchor={props.sectionId}
      key={`expandable-row-root`}
      categories={[]}
      changes={props.changeObjects.muutokset}
      isExpanded={true}
      showCategoryTitles={true}
      onChangesRemove={props.onChangesRemove}
      onUpdate={handleChanges}
      title={"Yksittäiset kunnat ja maakunnat tai koko maa"}>
      <Lomake
        action="modification"
        anchor={props.sectionId}
        changeObjects={props.changeObjects.muutokset}
        data={{
          isEiMaariteltyaToimintaaluettaChecked,
          isValtakunnallinenChecked,
          kunnatInLupa,
          lupakohde: props.lupakohde,
          maakunnatInLupa,
          lisattavatKunnat,
          lisattavatMaakunnat,
          valittavissaOlevatKunnat,
          valittavissaOlevatMaakunnat
        }}
        metadata={{ kohde: props.kohde, maaraystyyppi: props.maaraystyyppi }}
        onChangesUpdate={handleChanges}
        path={["toimintaalue"]}
        rules={[]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
});

MuutospyyntoWizardToimintaalue.defaultProps = {
  changeObjects: {},
  kohde: {},
  kunnat: [],
  lupakohde: {},
  maakunnat: [],
  maakuntakunnatList: [],
  maaraystyyppi: {}
};

MuutospyyntoWizardToimintaalue.propTypes = {
  changeObjects: PropTypes.object,
  kohde: PropTypes.object,
  kunnat: PropTypes.array,
  lupakohde: PropTypes.object,
  maakunnat: PropTypes.array,
  maakuntakunnatList: PropTypes.array,
  maaraystyyppi: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func
};

export default MuutospyyntoWizardToimintaalue;
