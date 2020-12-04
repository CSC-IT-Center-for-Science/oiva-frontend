import React, { useMemo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import wizard from "i18n/definitions/wizard";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";
import * as R from "ramda";

const constants = {
  formLocation: ["esiJaPerusopetus", "opetustaAntavatKunnat"],
  mode: "modification"
};

const OpetustaAntavatKunnat = React.memo(
  ({
    code,
    isPreviewModeOn,
    lupakohde,
    maaraykset,
    sectionId,
    title,
    valtakunnallinenMaarays
  }) => {
    const intl = useIntl();
    const [
      changeObjects,
      { setChanges }
    ] = useChangeObjectsByAnchorWithoutUnderRemoval({
      anchor: "toimintaalue"
    });

    const maakuntamaaraykset = R.filter(
      maarays => maarays.koodisto === "maakunta",
      maaraykset
    );

    const kuntamaaraykset = R.filter(maarays => {
      return (
        maarays.koodisto === "kunta" &&
        (!maarays.meta.changeObjects ||
          !R.includes("ulkomaa", maarays.meta.changeObjects[0].anchor))
      );
    }, maaraykset);

    const [isEditViewActive, toggleEditView] = useState(false);

    // const kunnatInLupa = useMemo(() => {
    //   console.info(kuntamaaraykset, lupakohde.kunnat);
    //   return R.sortBy(
    //     R.path(["metadata", "arvo"]),
    //     R.map(kunta => {
    //       const maarays = R.find(
    //         R.propEq("koodiarvo", kunta.koodiarvo),
    //         kuntamaaraykset
    //       );
    //       return {
    //         maaraysUuid: maarays ? maarays.uuid : null,
    //         title: kunta.arvo,
    //         metadata: kunta
    //       };
    //     }, lupakohde.kunnat || [])
    //   );
    // }, [kuntamaaraykset, lupakohde.kunnat]);

    // const maakunnatInLupa = useMemo(() => {
    //   return R.sortBy(
    //     R.path(["metadata", "arvo"]),
    //     R.map(maakunta => {
    //       return {
    //         title: maakunta.arvo,
    //         metadata: maakunta
    //       };
    //     }, lupakohde.maakunnat || [])
    //   );
    // }, [lupakohde.maakunnat]);

    const fiCode = R.view(R.lensPath(["valtakunnallinen", "arvo"]), lupakohde);

    const whenChanges = useCallback(
      changes => {
        const withoutCategoryFilterChangeObj = R.filter(
          R.compose(R.not, R.propEq("anchor", `${sectionId}.categoryFilter`)),
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
                  anchor: `${sectionId}.categoryFilter`,
                  properties: {
                    changesByProvince: changes.changesByProvince,
                    quickFilterChanges: changes.quickFilterChanges
                  }
                }
              ]
            : []
        );

        return setChanges(changesToSet, sectionId);
      },
      [changeObjects, sectionId, setChanges]
    );

    const provinceChanges = useMemo(() => {
      const changeObj = R.find(
        R.propEq("anchor", `${sectionId}.categoryFilter`),
        changeObjects
      );
      return changeObj ? changeObj.properties.changesByProvince : {};
    }, [changeObjects, sectionId]);

    const quickFilterChanges = useMemo(() => {
      const changeObj = R.find(
        R.propEq("anchor", `${sectionId}.categoryFilter`),
        changeObjects
      );
      return changeObj ? changeObj.properties.quickFilterChanges : {};
    }, [changeObjects, sectionId]);

    const noSelectionsInLupa =
      R.isEmpty(maakuntamaaraykset) && R.isEmpty(kuntamaaraykset) && fiCode !== "FI1";

    return (
      <Lomake
        mode={constants.mode}
        anchor={sectionId}
        code={code}
        data={{
          fiCode,
          isEditViewActive,
          isEiMaariteltyaToimintaaluettaChecked: fiCode === "FI2",
          isValtakunnallinenChecked: fiCode === "FI1",
          localizations: {
            accept: intl.formatMessage(common.accept),
            areaOfActionIsUndefined: intl.formatMessage(
              wizard.noMunicipalitiesSelected
            ),
            cancel: intl.formatMessage(common.cancel),
            currentAreaOfAction: intl.formatMessage(
              wizard.municipalitiesInPresentLupa
            ),
            newAreaOfAction: noSelectionsInLupa
              ? intl.formatMessage(wizard.municipalities)
              : intl.formatMessage(wizard.municipalitiesInNewLupa),
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
          kuntamaaraykset,
          maakuntamaaraykset,
          maaraykset,
          changeObjectsByProvince: Object.assign({}, provinceChanges),
          quickFilterChanges,
          valtakunnallinenMaarays
        }}
        functions={{
          onChanges: whenChanges,
          toggleEditView
        }}
        isPreviewModeOn={isPreviewModeOn}
        isRowExpanded={true}
        path={constants.formLocation}
        rowTitle={intl.formatMessage(
          wizard.singularMunicipalitiesOrTheWholeCountry
        )}
        showCategoryTitles={true}
        formTitle={title}
      />
    );
  }
);

OpetustaAntavatKunnat.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  kuntamaaraykset: PropTypes.array,
  lupakohde: PropTypes.object,
  maaraykset: PropTypes.array,
  sectionId: PropTypes.string,
  title: PropTypes.string,
  valtakunnallinenMaarays: PropTypes.object
};

export default OpetustaAntavatKunnat;
