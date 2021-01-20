import React, { useMemo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "../../../../../../../../i18n/definitions/common";
import wizard from "../../../../../../../../i18n/definitions/wizard";
import Lomake from "../../../../../../../../components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";
import * as R from "ramda";

const constants = {
  formLocation: ["toimintaalue"]
};

const MuutospyyntoWizardToimintaalue = React.memo(props => {
  const intl = useIntl();
  const [
    changeObjects,
    { setChanges }
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "toimintaalue"
  });

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

      return setChanges(changesToSet, props.sectionId);
    },
    [changeObjects, props.sectionId, setChanges]
  );

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

  return (
    <Lomake
      mode={props.mode}
      anchor={props.sectionId}
      code={props.code}
      data={{
        fiCode,
        isEditViewActive,
        isEiMaariteltyaToimintaaluettaChecked: fiCode === "FI2",
        isValtakunnallinenChecked: fiCode === "FI1",
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
          editButtonText: intl.formatMessage(wizard.editAreaOfAction),
          sameAsTheCurrentAreaOfAction: intl.formatMessage(
            wizard.sameAsTheCurrentAreaOfAction
          ),
          wholeCountryWithoutAhvenanmaa: intl.formatMessage(
            wizard.wholeCountryWithoutAhvenanmaa
          )
        },
        kunnatInLupa,
        lupakohde: props.lupakohde,
        maakunnatInLupa,
        changeObjectsByProvince: Object.assign({}, provinceChanges),
        quickFilterChanges,
        valtakunnallinenMaarays: props.valtakunnallinenMaarays
      }}
      functions={{
        onChanges: whenChanges,
        toggleEditView
      }}
      isRowExpanded={true}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(
        wizard.singularMunicipalitiesOrTheWholeCountry
      )}
      showCategoryTitles={true}
      formTitle={props.title}
    />
  );
});

MuutospyyntoWizardToimintaalue.defaultProps = {
  kuntamaaraykset: [],
  lupakohde: {},
  valtakunnallinenMaarays: {}
};

MuutospyyntoWizardToimintaalue.propTypes = {
  lupakohde: PropTypes.object,
  kuntamaaraykset: PropTypes.array,
  valtakunnallinenMaarays: PropTypes.object,
  sectionId: PropTypes.string
};

export default MuutospyyntoWizardToimintaalue;
