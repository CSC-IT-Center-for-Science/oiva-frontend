import React, { useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import common from "../../../../../../i18n/definitions/common";
import {
  getAnchorPart,
  replaceAnchorPartWith,
  removeAnchorPart
} from "../../../../../../utils/common";
import Lomake from "../../../../../../components/02-organisms/Lomake";
import * as R from "ramda";
import { useChangeObjects } from "../../../../../../stores/changeObjects";
import { isAdded, isRemoved, isInLupa } from "../../../../../../css/label";

const labelStyles = {
  addition: isAdded,
  removal: isRemoved
};

const mapping = {
  "01": "FI-18",
  "02": "FI-19",
  "04": "FI-17",
  "05": "FI-06",
  "06": "FI-11",
  "07": "FI-16",
  "08": "FI-09",
  "09": "FI-02",
  "10": "FI-04",
  "11": "FI-15",
  "12": "FI-13",
  "14": "FI-03",
  "16": "FI-07",
  "13": "FI-08",
  "15": "FI-12",
  "17": "FI-14",
  "18": "FI-05",
  "19": "FI-10",
  "21": "FI-01"
};

const MuutospyyntoWizardToimintaalue = React.memo(props => {
  const [changeObjects] = useChangeObjects();
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
      }, changeObjects.toimintaalue || []).filter(Boolean)
    );
  }, [changeObjects.toimintaalue]);

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
      }, changeObjects.toimintaalue || []).filter(Boolean)
    );
  }, [changeObjects.toimintaalue]);

  const kunnatInLupa = useMemo(() => {
    return R.sortBy(
      R.path(["metadata", "arvo"]),
      R.map(kunta => {
        const maarays = R.find(
          R.propEq("koodiarvo", kunta.koodiarvo),
          props.kuntamaaraykset
        );
        return {
          maaraysUuid: maarays ? maarays.uuid : null,
          title: kunta.arvo,
          metadata: kunta
        };
      }, props.lupakohde.kunnat)
    );
  }, [props.kuntamaaraykset, props.lupakohde.kunnat]);

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
    }, changeObjects.toimintaalue || []);
    return (
      (props.lupakohde.valtakunnallinen &&
        props.lupakohde.valtakunnallinen.arvo === "FI1" &&
        !valtakunnallinenChangeObject) ||
      (valtakunnallinenChangeObject &&
        valtakunnallinenChangeObject.properties.isChecked)
    );
  }, [changeObjects.toimintaalue, props.lupakohde.valtakunnallinen]);

  const isEiMaariteltyaToimintaaluettaChecked = useMemo(() => {
    const changeObject = R.find(changeObj => {
      return R.equals(
        getAnchorPart(changeObj.anchor, 1),
        "ei-maariteltya-toiminta-aluetta"
      );
    }, changeObjects.toimintaalue || []);
    return changeObject && changeObject.properties.isChecked;
  }, [changeObjects.toimintaalue]);

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
        changeObjects.toimintaalue || []
      );
      if (!R.equals(radioButtonChangeObjects, changeObjects.toimintaalue)) {
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
    changeObjects.toimintaalue,
    props.sectionId
  ]);

  /**
   * Changes are handled here. Changes objects will be formed and callback
   * function will be called with them.
   */
  const handleChanges = useCallback(
    changesByAnchor => {
      console.info(changesByAnchor);
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
              changeObjects.toimintaalue || []
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
      changeObjects.toimintaalue,
      props.maakuntakunnatList
    ]
  );

  const kuntaMaakuntaMapping = useMemo(() => {
    const result = R.flatten(
      R.map(maakunta => {
        return R.map(kunta => {
          return {
            kuntaKoodiarvo: kunta.koodiArvo,
            maakuntaKey: mapping[maakunta.koodiArvo]
          };
        }, maakunta.kunta);
      }, props.maakuntakunnatList)
    );
    return result;
  }, [props.maakuntakunnatList]);

  const options = useMemo(() => {
    const localeUpper = intl.locale.toUpperCase();
    return R.addIndex(R.map)((maakunta, index) => {
      return {
        anchor: mapping[maakunta.koodiArvo],
        formId: mapping[maakunta.koodiArvo],
        components: [
          {
            anchor: "A",
            name: "CheckboxWithLabel",
            properties: {
              code: maakunta.koodiArvo,
              forChangeObject: {
                koodiarvo: maakunta.koodiArvo,
                maakuntaKey: mapping[maakunta.koodiArvo],
                title: maakunta.label
              },
              isChecked: false,
              labelStyles: Object.assign({}, labelStyles, {
                custom: isInLupa
              }),
              name: maakunta.koodiArvo,
              title: maakunta.label
            }
          }
        ],
        categories: [
          {
            anchor: "kunnat",
            formId: mapping[maakunta.koodiArvo],
            components: R.map(kunta => {
              const kunnanNimi = (
                R.find(R.propEq("kieli", localeUpper), kunta.metadata) || {}
              ).nimi;
              return {
                anchor: kunta.koodiArvo,
                name: "CheckboxWithLabel",
                styleClasses: ["w-1/2"],
                properties: {
                  code: kunta.koodiArvo,
                  forChangeObject: {
                    koodiarvo: kunta.koodiArvo,
                    title: kunnanNimi,
                    maakuntaKey: mapping[maakunta.koodiArvo]
                  },
                  isChecked: false,
                  labelStyles: Object.assign({}, labelStyles, {
                    custom: isInLupa
                  }),
                  name: kunta.koodiArvo,
                  title: kunnanNimi
                }
              };
            }, maakunta.kunta)
          }
        ]
      };
    }, props.maakuntakunnatList);
  }, [intl.locale, props.maakuntakunnatList]);

  return options.length ? (
    <ExpandableRowRoot
      anchor={props.sectionId}
      key={`expandable-row-root`}
      categories={[]}
      changes={changeObjects.toimintaalue}
      hideAmountOfChanges={true}
      messages={{ undo: intl.formatMessage(common.undo) }}
      isExpanded={true}
      showCategoryTitles={true}
      onChangesRemove={props.onChangesRemove}
      onUpdate={handleChanges}
      title={"Yksittäiset kunnat ja maakunnat tai koko maa"}>
      <Lomake
        action="modification"
        anchor={props.sectionId}
        changeObjects={changeObjects.toimintaalue}
        data={{
          isEiMaariteltyaToimintaaluettaChecked,
          isValtakunnallinenChecked,
          kunnatInLupa,
          maakuntakunnatList: props.maakuntakunnatList,
          lupakohde: props.lupakohde,
          maakunnatInLupa,
          lisattavatKunnat,
          lisattavatMaakunnat,
          options,
          valittavissaOlevatKunnat,
          valittavissaOlevatMaakunnat,
          valtakunnallinenMaarays: props.valtakunnallinenMaarays
        }}
        onChangesUpdate={handleChanges}
        path={["toimintaalue"]}
        rules={[]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  ) : null;
});

MuutospyyntoWizardToimintaalue.defaultProps = {
  kunnat: [],
  kuntamaaraykset: [],
  lupakohde: {},
  maakunnat: [],
  maakuntakunnatList: []
};

MuutospyyntoWizardToimintaalue.propTypes = {
  kunnat: PropTypes.array,
  lupakohde: PropTypes.object,
  maakunnat: PropTypes.array,
  maakuntakunnatList: PropTypes.array,
  kuntamaaraykset: PropTypes.array,
  valtakunnallinenMaarays: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func
};

export default MuutospyyntoWizardToimintaalue;
