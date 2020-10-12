import React, { useMemo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import common from "../../../i18n/definitions/common";
import wizard from "../../../i18n/definitions/wizard";
import Lomake from "../../../components/02-organisms/Lomake";
import { isAdded, isRemoved, isInLupa } from "../../../css/label";
import kuntaProvinceMapping from "../../../utils/kuntaProvinceMapping";
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

const OpetustaAntavatKunnat = props => {
  const { changeObjects } = props;
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
      }, props.lupakohde.kunnat || [])
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
      }, props.lupakohde.maakunnat || [])
    );
  }, [props.lupakohde.maakunnat]);

  const fiCode = R.view(
    R.lensPath(["valtakunnallinen", "arvo"]),
    props.lupakohde
  );

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
    changes => {
      const withoutCategoryFilterChangeObj = R.filter(
        R.compose(R.not, R.propEq("anchor", "categoryFilter")),
        changeObjects
      );

      const amountOfChanges = R.flatten(R.values(changes.changesByProvince))
        .length;
      const amountOfQuickFilterChanges = R.flatten(
        R.values(changes.quickFilterChanges)
      ).length;

      const changesToSet = R.concat(
        withoutCategoryFilterChangeObj,
        amountOfChanges || amountOfQuickFilterChanges
          ? [
              {
                anchor: "categoryFilter",
                properties: {
                  changesByProvince: changes.changesByProvince,
                  quickFilterChanges: changes.quickFilterChanges
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
    [changeObjects, onChangesUpdate, props.sectionId]
  );

  /**
   * Form structure will be created here.
   */
  const options = useMemo(() => {
    const localeUpper = intl.locale.toUpperCase();
    const maaraysUuid = props.valtakunnallinenMaarays.uuid;
    return R.map(maakunta => {
      // 21 = Ahvenanmaa, 99 = Ei tiedossa
      if (maakunta.koodiarvo === "21" || maakunta.koodiarvo === "99") {
        return null;
      }

      const isMaakuntaInLupa = !!R.find(province => {
        return province.metadata.koodiarvo === maakunta.koodiarvo;
      }, maakunnatInLupa);

      let someMunicipalitiesInLupa = false;
      let someMunicipalitiesNotInLupa = false;

      const today = new Date();
      const presentKunnat = R.filter(
        ({ voimassaLoppuPvm }) =>
          !voimassaLoppuPvm || new Date(voimassaLoppuPvm) >= today,
        maakunta.kunnat
      );

      const municipalitiesOfProvince = R.map(kunta => {
        const kunnanNimi = kunta.metadata[localeUpper].nimi;

        const isKuntaInLupa = !!R.find(
          R.pathEq(["metadata", "koodiarvo"], kunta.koodiarvo),
          kunnatInLupa
        );

        if (isKuntaInLupa) {
          someMunicipalitiesInLupa = true;
        } else {
          someMunicipalitiesNotInLupa = true;
        }

        return {
          anchor: kunta.koodiarvo,
          name: "CheckboxWithLabel",
          styleClasses: ["w-1/2"],
          properties: {
            code: kunta.koodiarvo,
            forChangeObject: {
              koodiarvo: kunta.koodiarvo,
              title: kunnanNimi,
              maakuntaKey: mapping[maakunta.koodiarvo],
              maaraysUuid
            },
            isChecked: isKuntaInLupa || isMaakuntaInLupa || fiCode === "FI1",
            labelStyles: Object.assign({}, labelStyles, {
              custom: isInLupa
            }),
            name: kunta.koodiarvo,
            title: kunnanNimi
          }
        };
      }, presentKunnat);

      const isKuntaOfMaakuntaInLupa = !!R.find(kunta => {
        let maakuntaCode;
        const result = R.find(
          k =>
            R.propEq("kuntaKoodiarvo", kunta.metadata.koodiarvo, k) &&
            R.includes(
              k.kuntaKoodiarvo,
              R.map(R.prop("koodiarvo"), presentKunnat)
            ),
          kuntaProvinceMapping
        );

        if (result) {
          R.mapObjIndexed((value, key) => {
            if (value === result.maakuntaKey) {
              maakuntaCode = key;
            }
          }, mapping);
        }
        return maakuntaCode === maakunta.koodiarvo;
      }, kunnatInLupa);

      return {
        anchor: mapping[maakunta.koodiarvo],
        formId: mapping[maakunta.koodiarvo],
        components: [
          {
            anchor: "A",
            name: "CheckboxWithLabel",
            properties: {
              code: maakunta.koodiarvo,
              forChangeObject: {
                koodiarvo: maakunta.koodiarvo,
                maakuntaKey: mapping[maakunta.koodiarvo],
                title: maakunta.label,
                maaraysUuid
              },
              isChecked:
                fiCode === "FI1" || isMaakuntaInLupa || isKuntaOfMaakuntaInLupa,
              isIndeterminate:
                !isMaakuntaInLupa &&
                someMunicipalitiesInLupa &&
                someMunicipalitiesNotInLupa,
              labelStyles: Object.assign({}, labelStyles, {
                custom: isInLupa
              }),
              name: maakunta.koodiarvo,
              title: maakunta.metadata[localeUpper].nimi
            }
          }
        ],
        categories: [
          {
            anchor: "kunnat",
            formId: mapping[maakunta.koodiarvo],
            components: municipalitiesOfProvince
          }
        ]
      };
    }, props.maakuntakunnat).filter(Boolean);
  }, [
    intl.locale,
    fiCode,
    kunnatInLupa,
    maakunnatInLupa,
    props.maakuntakunnat,
    props.valtakunnallinenMaarays
  ]);

  const kunnatWithoutAhvenanmaan = useMemo(() => {
    return R.filter(kunta => {
      const result = R.find(
        R.propEq("kuntaKoodiarvo", kunta.koodiArvo),
        kuntaProvinceMapping
      );
      return (
        result && result.maakuntaKey !== "FI-01" && kunta.koodiArvo !== "200" // 200 Ulkomaa
      );
    }, props.kunnat);
  }, [props.kunnat]);

  const provincesWithoutAhvenanmaa = useMemo(() => {
    return R.filter(maakunta => {
      // 21 = Ahvenanmaa
      return maakunta.koodiArvo !== "21";
    }, props.maakunnat);
  }, [props.maakunnat]);

  const provinceChanges = useMemo(() => {
    const changeObj = R.find(
      R.propEq("anchor", "categoryFilter"),
      changeObjects
    );
    return changeObj ? changeObj.properties.changesByProvince : {};
  }, [changeObjects]);

  const quickFilterChanges = useMemo(() => {
    const changeObj = R.find(
      R.propEq("anchor", "categoryFilter"),
      changeObjects
    );
    return changeObj ? changeObj.properties.quickFilterChanges : {};
  }, [changeObjects]);

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  return (
    <ExpandableRowRoot
      anchor={props.sectionId}
      key={`expandable-row-root`}
      changes={changeObjects}
      hideAmountOfChanges={true}
      messages={changesMessages}
      isExpanded={true}
      sectionId={props.sectionId}
      showCategoryTitles={true}
      onChangesRemove={props.onChangesRemove}
      onUpdate={handleChanges}
      title={intl.formatMessage(
        wizard.municipalitiesAndAreas
      )}>
      <Lomake
        action="modification"
        anchor={props.sectionId}
        changeObjects={changeObjects}
        data={{
          fiCode,
          isEditViewActive,
          isEiMaariteltyaToimintaaluettaChecked: fiCode === "FI2",
          isValtakunnallinenChecked: fiCode === "FI1",
          kunnat: kunnatWithoutAhvenanmaan,
          localizations: {
            accept: intl.formatMessage(common.accept),
            areaOfActionIsUndefined: intl.formatMessage(
              wizard.noMunicipalitiesSelected
            ),
            cancel: intl.formatMessage(common.cancel),
            currentAreaOfAction: intl.formatMessage(wizard.currentAreaOfAction),
            newAreaOfAction: intl.formatMessage(wizard.newAreaOfAction),
            ofMunicipalities: intl.formatMessage(wizard.ofMunicipalities),
            quickFilter: intl.formatMessage(wizard.quickFilter),
            editButtonText: intl.formatMessage(wizard.selectMunicipalities),
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
          changeObjectsByProvince: Object.assign({}, provinceChanges),
          quickFilterChanges
        }}
        onChangesUpdate={handleChanges}
        path={["esiJaPerusopetus", "opetustaAntavatKunnat"]}
        showCategoryTitles={true}
      />
    </ExpandableRowRoot>
  );
};

OpetustaAntavatKunnat.defaultProps = {
  changeObjects: [],
  kunnat: [],
  kuntamaaraykset: [],
  lupakohde: {},
  maakunnat: [],
  maakuntakunnat: [],
  valtakunnallinenMaarays: {}
};

OpetustaAntavatKunnat.propTypes = {
  changeObjects: PropTypes.array,
  kunnat: PropTypes.array,
  lupakohde: PropTypes.object,
  maakunnat: PropTypes.array,
  maakuntakunnat: PropTypes.array,
  kuntamaaraykset: PropTypes.array,
  valtakunnallinenMaarays: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  sectionId: PropTypes.string
};

export default OpetustaAntavatKunnat;
