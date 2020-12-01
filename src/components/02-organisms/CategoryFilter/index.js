import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  map,
  prop,
  addIndex,
  zipObj,
  equals,
  values,
  flatten,
  sort
} from "ramda";

import Modify from "./Modify";
import SimpleButton from "../../00-atoms/SimpleButton";
import { Province } from "./province";
import Country from "./country";
import { Typography } from "@material-ui/core";

const CategoryFilter = ({
  anchor = "no-anchor-defined",
  changeObjectsByProvince = {},
  isEditViewActive = false,
  localizations = {},
  municipalities = [],
  onChanges,
  toggleEditView,
  provinces = [],
  provincesWithoutMunicipalities = [],
  quickFilterChangeObjects = [],
  nothingInLupa = false,
  koulutustyyppi = ""
}) => {
  const [changeObjects, setChangeObjects] = useState(changeObjectsByProvince);
  const [quickFilterChanges, setQuickFilterChanges] = useState(
    quickFilterChangeObjects
  );

  useEffect(() => {
    setChangeObjects(changeObjectsByProvince);
  }, [changeObjectsByProvince]);

  const provinceInstances = useMemo(() => {
    const provinceIds = map(prop("anchor"), provinces);
    const instances = map(province => {
      return new Province(province, anchor);
    }, provinces);
    return zipObj(provinceIds, instances);
  }, [anchor, provinces]);

  const country = useMemo(() => {
    return new Country(provinceInstances);
  }, [provinceInstances]);

  /**
   * Renders a list of active provinces and municipalities.
   * @param {array} provinces - List of all provinces in Finland except Åland.
   * @param {object} changeObjects - Change objects of all provinces by province's anchor.
   */
  function renderToimintaalueList(provinces, changeObjects = {}) {
    let isEverythingActive = true;
    let zeroPercentages = [];

    const markup = map(province => {
      const provinceInstance = provinceInstances[province.anchor];
      const isProvinceActive = provinceInstance.isActive(
        changeObjects[province.anchor]
      );
      const activeMunicipalities = provinceInstance.getActiveMunicipalities(
        changeObjects[province.anchor]
      );
      const percentage = Math.round(
        (activeMunicipalities.length /
          province.categories[0].components.length) *
          100
      );
      if (percentage < 100) {
        isEverythingActive = false;
      }
      if (percentage === 0) {
        zeroPercentages.push(province.components[0].properties.title);
      }
      if (isProvinceActive) {
        const activeMunicipalitiesInAlphabeticOrder = sort((a, b) => {
          const titleA = a.getTitle();
          const titleB = b.getTitle();
          if (titleA < titleB) {
            return -1;
          } else if (titleA > titleB) {
            return 1;
          } else {
            return 0;
          }
        }, activeMunicipalities);
        return (
          <li key={province.anchor} className={"w-1/2 pt-4 pb-6 pr-6"}>
            <div className="flex items-baseline">
              <Typography component="h4" variant="h4">
                {province.components[0].properties.title}
              </Typography>
              <p className="ml-2 text-xs">
                ({percentage}% {localizations.ofMunicipalities})
              </p>
            </div>
            {percentage < 100 ? (
              <ul className={"ml-4 mt-4"}>
                <li>
                  {addIndex(map)((kunta, index) => {
                    return (
                      <span key={`kunta-${index}`}>
                        {kunta.getTitle()}
                        {activeMunicipalities[index + 1] ? ", " : null}
                      </span>
                    );
                  }, activeMunicipalitiesInAlphabeticOrder).filter(Boolean)}
                </li>
              </ul>
            ) : null}
          </li>
        );
      }
      return null;
    }, provinces || []).filter(Boolean);

    if (isEverythingActive) {
      return (
        <p className="pt-4 pb-8">
          {localizations.wholeCountryWithoutAhvenanmaa}
        </p>
      );
    } else if (zeroPercentages.length === provinces.length) {
      return (
        <p className="pt-4 pb-8">{localizations.areaOfActionIsUndefined}</p>
      );
    } else {
      return <ul className="flex flex-wrap ml-8">{markup}</ul>;
    }
  }

  if (isEditViewActive) {
    return (
      <Modify
        provinceInstances={provinceInstances}
        anchor={anchor}
        categories={provinces}
        country={country}
        municipalities={municipalities}
        localizations={localizations}
        provincesWithoutMunicipalities={provincesWithoutMunicipalities}
        onClose={(quickFilterChanges, changesByProvince) => {
          toggleEditView(false);
          setChangeObjects(changesByProvince);
          setQuickFilterChanges(quickFilterChanges);
          if (changesByProvince) {
            onChanges({
              changesByProvince,
              quickFilterChanges
            });
          } else if (!equals(changeObjects, changeObjectsByProvince)) {
            onChanges({ changeObjectsByProvince, quickFilterChanges });
          }
        }}
        changeObjectsByProvince={changeObjects}
        quickFilterChangeObjects={quickFilterChanges}
      />
    );
  } else {
    const isEsiJaPerusopetus = koulutustyyppi === "esiJaPerusopetus";

    /** Esi- ja perusopetuksen layout */
    if (isEsiJaPerusopetus) {
      return (
        <React.Fragment>
          {!nothingInLupa && (
            <span>
              <Typography component="h3" variant="h3">
                {localizations.currentAreaOfAction}
              </Typography>
              {renderToimintaalueList(provinces)}
            </span>
          )}
          <React.Fragment>
            {!nothingInLupa && <hr />}
            <Typography component="h3" variant="h3">
              {localizations.newAreaOfAction}
            </Typography>
            {renderToimintaalueList(provinces, changeObjects)}
          </React.Fragment>
          <div className={"pt-6"}>
            <SimpleButton
              variant="outlined"
              onClick={() => toggleEditView(true)}
              text={localizations.editButtonText}></SimpleButton>
          </div>
        </React.Fragment>
      );
    } else {
      /** Default layout */
      return (
        <React.Fragment>
          <Typography component="h3" variant="h3">
            {localizations.currentAreaOfAction}
          </Typography>
          {renderToimintaalueList(provinces)}
          {flatten(values(changeObjects)).length > 0 && (
            <React.Fragment>
              <hr />
              <Typography component="h3" variant="h3">
                {localizations.newAreaOfAction}
              </Typography>
              {renderToimintaalueList(provinces, changeObjects)}
            </React.Fragment>
          )}
          <div className={"pt-6"}>
            <SimpleButton
              variant="outlined"
              onClick={() => toggleEditView(true)}
              text={localizations.editButtonText}></SimpleButton>
          </div>
        </React.Fragment>
      );
    }
  }
};

CategoryFilter.propTypes = {
  anchor: PropTypes.string,
  categories: PropTypes.array,
  changeObjectsByProvince: PropTypes.object,
  localizations: PropTypes.object,
  municipalities: PropTypes.array,
  onChanges: PropTypes.func.isRequired,
  toggleEditView: PropTypes.func.isRequired,
  provincesWithoutMunicipalities: PropTypes.array,
  nothingInLupa: PropTypes.bool,
  koulutustyyppi: PropTypes.string
};

export default CategoryFilter;
