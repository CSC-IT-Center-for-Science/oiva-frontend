import React, { useEffect, useMemo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import common from "../../../../../../i18n/definitions/common";
import wizard from "../../../../../../i18n/definitions/wizard";
import Lomake from "../../../../../../components/02-organisms/Lomake";
import { useChangeObjects } from "../../../../../../stores/changeObjects";
import { isAdded, isRemoved, isInLupa } from "../../../../../../css/label";
import kuntaProvinceMapping from "./kuntaProvinceMapping";
import * as R from "ramda";

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

  const [isEditViewActive, toggleEditView] = useState(false);

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

  const fiCode = R.view(
    R.lensPath(["valtakunnallinen", "arvo"]),
    props.lupakohde
  );

  /**
   * There are three radio buttons in Toiminta-alue section: 1) Maakunnat and kunnat
   * 2) Koko Suomi - pois lukien Ahvenanmaan maakunta 3) Ei määriteltyä toiminta-aluetta.
   * When one of them is selected the change objects under other ones have to be deleted.
   * This function deletes them.
   */
  useEffect(() => {
    if (fiCode !== "FI0") {
      // Let's check if updating is necessary.
      const radioButtonChangeObjects = R.filter(
        R.compose(R.includes("radio"), R.prop("anchor")),
        changeObjects.toimintaalue || []
      );
      if (!R.equals(radioButtonChangeObjects, changeObjects.toimintaalue)) {
        // Fist we are going to update the change objects of Toiminta-alue section
        // on form page one.
        // onChangesUpdate({
        //   anchor: props.sectionId,
        //   changes: radioButtonChangeObjects
        // });
        // Then it's time to get rid of the change objects of form page two (reasoning).
        onChangesUpdate({
          anchor: `perustelut_${props.sectionId}`,
          changes: []
        });
      }
    }
  }, [fiCode, onChangesUpdate, changeObjects.toimintaalue, props.sectionId]);

  /**
   * Changes are handled here. Changes objects will be formed and callback
   * function will be called with them.
   */
  const handleChanges = useCallback(
    changesByAnchor => {
      const updatedChanges = R.filter(
        R.compose(R.not, R.propEq("anchor", "toimintaalue.")),
        changesByAnchor.changes
      );
      const categoryFilterChanges = R.uniq(R.flatten(updatedChanges)).filter(
        Boolean
      );
      const sectionChanges = {
        anchor: changesByAnchor.anchor,
        changes: categoryFilterChanges
      };
      onChangesUpdate(sectionChanges);
    },
    [onChangesUpdate]
  );

  const whenChanges = useCallback(
    changesByMaakunta => {
      const withoutCategoryFilterChangeObj = R.filter(
        R.compose(R.not, R.propEq("anchor", "categoryFilter")),
        changeObjects.toimintaalue
      );

      const amountOfChanges = R.flatten(R.values(changesByMaakunta)).length;

      const changesToSet = R.concat(
        withoutCategoryFilterChangeObj,
        amountOfChanges
          ? [
              {
                anchor: "categoryFilter",
                properties: {
                  changeObjects: changesByMaakunta
                }
              }
            ]
          : []
      );

      return onChangesUpdate({
        anchor: props.sectionId,
        changes: changesToSet
      });
    },
    [changeObjects.toimintaalue, onChangesUpdate, props.sectionId]
  );

  /**
   * Form structure will be created here.
   */
  const options = useMemo(() => {
    const localeUpper = intl.locale.toUpperCase();
    const maaraysUuid = props.valtakunnallinenMaarays.uuid;
    return R.map(maakunta => {
      // 21 = Ahvenanmaa
      if (maakunta.koodiarvo === "21") {
        return null;
      }

      const isMaakuntaInLupa = !!R.find(province => {
        return province.metadata.koodiarvo === maakunta.koodiArvo;
      }, maakunnatInLupa);

      let numberOfMunicipalitiesInLupa = 0;

      const municipalitiesOfProvince = R.map(kunta => {
        const kunnanNimi = (
          R.find(R.propEq("kieli", localeUpper), kunta.metadata) || {}
        ).nimi;

        const isKuntaInLupa = !!R.find(
          R.pathEq(["metadata", "koodiarvo"], kunta.koodiarvo),
          kunnatInLupa
        );

        if (isKuntaInLupa) {
          numberOfMunicipalitiesInLupa += 1;
        }

        return {
          anchor: kunta.koodiArvo,
          name: "CheckboxWithLabel",
          styleClasses: ["w-1/2"],
          properties: {
            code: kunta.koodiArvo,
            forChangeObject: {
              koodiarvo: kunta.koodiArvo,
              title: kunnanNimi,
              maakuntaKey: mapping[maakunta.koodiArvo],
              maaraysUuid
            },
            isChecked: isKuntaInLupa || isMaakuntaInLupa || fiCode === "FI1",
            labelStyles: Object.assign({}, labelStyles, {
              custom: isInLupa
            }),
            name: kunta.koodiArvo,
            title: kunnanNimi
          }
        };
      }, maakunta.kunta);

      const isKuntaOfMaakuntaInLupa = !!R.find(kunta => {
        let maakuntaCode;
        const result = R.find(
          R.propEq("kuntaKoodiarvo", kunta.metadata.koodiarvo),
          kuntaProvinceMapping
        );
        if (result) {
          R.mapObjIndexed((value, key) => {
            if (value === result.maakuntaKey) {
              maakuntaCode = key;
            }
          }, mapping);
        }
        return maakuntaCode === maakunta.koodiArvo;
      }, kunnatInLupa);
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
                title: maakunta.label,
                maaraysUuid
              },
              isChecked:
                isMaakuntaInLupa || isKuntaOfMaakuntaInLupa || fiCode === "FI1",
              isIndeterminate:
                numberOfMunicipalitiesInLupa > 0 &&
                numberOfMunicipalitiesInLupa < maakunta.kunta.length,
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
            components: municipalitiesOfProvince
          }
        ]
      };
    }, props.maakuntakunnatList).filter(Boolean);
  }, [
    intl.locale,
    fiCode,
    kunnatInLupa,
    maakunnatInLupa,
    props.maakuntakunnatList,
    props.valtakunnallinenMaarays
  ]);

  const kunnatWithoutAhvenanmaan = useMemo(() => {
    return R.filter(kunta => {
      const result = R.find(
        R.propEq("kuntaKoodiarvo", kunta.koodiArvo),
        kuntaProvinceMapping
      );
      return result && result.maakuntaKey !== "FI-01";
    }, props.kunnat);
  }, [props.kunnat]);

  const provincesWithoutAhvenanmaa = useMemo(() => {
    return R.filter(maakunta => {
      // 21 = Ahvenanmaa
      return maakunta.koodiArvo !== "21";
    }, props.maakunnat);
  }, [props.maakunnat]);

  const categoryFilterChanges = useMemo(() => {
    const changeObj = R.find(
      R.propEq("anchor", "categoryFilter"),
      changeObjects.toimintaalue
    );
    return changeObj ? changeObj.properties.changeObjects : {};
  }, [changeObjects.toimintaalue]);

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  return (
    <ExpandableRowRoot
      anchor={props.sectionId}
      key={`expandable-row-root`}
      changes={changeObjects.toimintaalue}
      hideAmountOfChanges={true}
      messages={changesMessages}
      isExpanded={true}
      sectionId={props.sectionId}
      showCategoryTitles={true}
      onChangesRemove={props.onChangesRemove}
      onUpdate={handleChanges}
      title={intl.formatMessage(
        wizard.singularMunicipalitiesOrTheWholeCountry
      )}>
      <Lomake
        action="modification"
        anchor={props.sectionId}
        changeObjects={changeObjects.toimintaalue}
        data={{
          fiCode,
          isEditViewActive,
          isEiMaariteltyaToimintaaluettaChecked: fiCode === "FI2",
          isValtakunnallinenChecked: fiCode === "FI1",
          kunnat: kunnatWithoutAhvenanmaan,
          localizations: {
            accept: intl.formatMessage(common.accept),
            areaOfActionIsUndefined: intl.formatMessage(
              wizard.areaOfActionIsUndefined
            ),
            cancel: intl.formatMessage(common.cancel),
            currentAreaOfAction: intl.formatMessage(wizard.currentAreaOfAction),
            newAreaOfAction: intl.formatMessage(wizard.newAreaOfAction),
            ofMunicipalities: intl.formatMessage(wizard.ofMunicipalities),
            quickFilter: intl.formatMessage(wizard.quickFilter),
            sameAsTheCurrentAreaOfAction: intl.formatMessage(
              wizard.sameAsTheCurrentAreaOfAction
            ),
            wholeCountryWithoutAhvenanmaa: intl.formatMessage(
              wizard.wholeCountryWithoutAhvenanmaa
            )
          },
          maakunnat: provincesWithoutAhvenanmaa,
          onChanges: whenChanges,
          toggleEditView,
          options,
          changeObjectsByProvince: categoryFilterChanges
        }}
        onChangesUpdate={handleChanges}
        path={["toimintaalue"]}
        rules={[]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
});

MuutospyyntoWizardToimintaalue.defaultProps = {
  kunnat: [],
  kuntamaaraykset: [],
  lupakohde: {},
  maakunnat: [],
  maakuntakunnatList: [],
  valtakunnallinenMaarays: {}
};

MuutospyyntoWizardToimintaalue.propTypes = {
  kunnat: PropTypes.array,
  lupakohde: PropTypes.object,
  maakunnat: PropTypes.array,
  maakuntakunnatList: PropTypes.array,
  kuntamaaraykset: PropTypes.array,
  valtakunnallinenMaarays: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  sectionId: PropTypes.string
};

export default MuutospyyntoWizardToimintaalue;
