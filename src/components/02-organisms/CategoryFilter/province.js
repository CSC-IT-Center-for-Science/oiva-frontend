import {
  find,
  propEq,
  filter,
  assoc,
  dissoc,
  append,
  map,
  concat,
  flatten,
  mapObjIndexed,
  equals,
  values,
  includes,
  forEach,
  compose,
  not
} from "ramda";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import mix from "./province-utils";
import { getRemovalChangeObj } from "./kunta-utils";
import { getAdditionChangeObj as getMunicipalityAdditionChangeObj } from "./kunta-utils";
import Municipality from "./municipality";

export function Province(province, baseAnchor) {
  const id = province.anchor;
  const code = province.components[0].properties.code;
  const title = province.components[0].properties.title;
  const kunnatAmount = province.categories[0].components.length;

  const municipalityInstances = {};

  forEach(municipality => {
    const instance = new Municipality(baseAnchor, municipality);
    municipalityInstances[instance.getKoodiarvo()] = instance;
  }, province.categories[0].components);

  let polygonSeries = null;
  let polygon = null;
  let labelSeries = null;
  let kartta = null;
  let labelTemplate;

  function getAnchor() {
    return `${baseAnchor}.${id}.${province.components[0].anchor}`;
  }

  function getActiveMunicipalities(changeObjects = []) {
    return filter(municipality => {
      return municipality.isActive(changeObjects);
    }, values(municipalityInstances));
  }

  function getAdditionChangeObj(isIndeterminate) {
    return {
      anchor: getAnchor(),
      properties: {
        isChecked: true,
        isIndeterminate,
        metadata: {
          title,
          koodiarvo: code,
          provinceKey: id
        }
      }
    };
  }

  function getChangeObject(currentChangeObjProps = {}, targetProperties = {}) {
    const originalProperties = province.components[0].properties;

    const isOriginalOK = !includes(
      false,
      values(
        mapObjIndexed((value, key) => {
          return equals(originalProperties[key], value) ? true : false;
        }, targetProperties)
      )
    );

    const isCurrentChangeObjOK = !includes(
      false,
      values(
        mapObjIndexed((value, key) => {
          return equals(currentChangeObjProps[key], value) ? true : false;
        }, targetProperties)
      )
    );

    if (isOriginalOK) {
      return null;
    } else {
      const anchor = getAnchor();
      if (isCurrentChangeObjOK) {
        return {
          anchor,
          properties: currentChangeObjProps
        };
      } else {
        const changeObj = {
          anchor,
          properties: Object.assign(
            {},
            currentChangeObjProps,
            targetProperties,
            {
              metadata: {
                title,
                koodiarvo: code,
                provinceKey: id
              }
            }
          )
        };
        return changeObj;
      }
    }
  }

  function getMunicipalities() {
    return province.categories[0].components;
  }

  function _getRemovalChangeObj() {
    return {
      anchor: getAnchor(),
      properties: {
        isChecked: false,
        isIndeterminate: false,
        metadata: {
          title,
          koodiarvo: code,
          provinceKey: id
        }
      }
    };
  }

  function isActive(changeObjects = []) {
    const changeObj = find(propEq("anchor", getAnchor()), changeObjects);
    return (
      (province.components[0].properties.isChecked && !changeObj) ||
      (changeObj && changeObj.properties.isChecked)
    );
  }

  function isIndeterminate(changeObjects = []) {
    const changeObj = find(propEq("anchor", getAnchor()), changeObjects);
    return (
      (province.components[0].properties.isIndeterminate && !changeObj) ||
      (changeObj && changeObj.properties.isIndeterminate)
    );
  }

  function isMunicipalityActive(koodiarvo, changeObjects = []) {
    const instance = koodiarvo ? municipalityInstances[koodiarvo] : null;
    if (!instance) {
      console.warn(
        "Couldn't find the municipality instance by koodiarvo",
        koodiarvo,
        municipalityInstances
      );
    }
    return instance ? instance.isActive(changeObjects) : false;
  }

  return {
    activateFully: () => {
      // Activate province
      const isActiveByDefault = isActive();
      const isIndeterminateByDefault = isIndeterminate();
      let provinceChangeObj = null;

      if (!isActiveByDefault || isIndeterminateByDefault) {
        provinceChangeObj = getAdditionChangeObj(false);
      }

      // Activate municipalities
      const municipalityChangeObjects = map(municipality => {
        if (!municipality.properties.isChecked) {
          return !isMunicipalityActive(municipality.anchor)
            ? getMunicipalityAdditionChangeObj(
                baseAnchor,
                id,
                municipality.properties.title,
                municipality.anchor
              )
            : null;
        }
      }, getMunicipalities()).filter(Boolean);

      return concat([provinceChangeObj], municipalityChangeObjects).filter(
        Boolean
      );
    },
    activateMunicipality: (koodiarvo, changeObjects = []) => {
      const municipality = municipalityInstances[koodiarvo];
      let nextChangeObjects = changeObjects;
      if (!municipality) {
        console.warn("Couldn't find a municipality with koodiarvo", koodiarvo);
      } else {
        nextChangeObjects = filter(
          changeObj => changeObj.anchor !== municipality.getAnchor(),
          changeObjects
        );
        const changeObj =
          find(propEq("anchor", municipality.getAnchor()), changeObjects) || {};
        const nextChangeObj = municipality.getChangeObject(
          changeObj.properties,
          {
            isChecked: true
          }
        );
        if (nextChangeObj) {
          nextChangeObjects = append(nextChangeObj, nextChangeObjects);
        }
      }
      /**
       * The province might not be active. Let's get a change object for it.
       */
      const activeMunicipalities = getActiveMunicipalities(nextChangeObjects);
      const changeObj =
        find(propEq("anchor", getAnchor()), changeObjects) || {};
      nextChangeObjects = filter(
        changeObj => changeObj.anchor !== getAnchor(),
        nextChangeObjects
      );
      const nextProvinceChangeObj = getChangeObject(changeObj.properties, {
        isChecked: true,
        isIndeterminate:
          activeMunicipalities.length !== getMunicipalities().length
      });

      if (nextProvinceChangeObj) {
        nextChangeObjects = append(nextProvinceChangeObj, nextChangeObjects);
      }

      return nextChangeObjects;
    },
    areAllMunicipalitiesActive: (changeObjects = [], activeMunicipalities) => {
      return activeMunicipalities
        ? activeMunicipalities.length === getMunicipalities().length
        : getActiveMunicipalities(changeObjects).length ===
            getMunicipalities().length;
    },
    /**
     * Function updates the color and percentage of province.
     */
    colorize: (changeObjects = []) => {
      if (!id || !polygonSeries) return false;
      let polygonSerie = find(propEq("id", id), polygonSeries.data);
      if (polygonSerie) {
        polygonSerie.fill = am4core.color("#ff0000");
      }
      const valitutKunnat = getActiveMunicipalities(changeObjects) || [];

      const percentage = (valitutKunnat.length / kunnatAmount) * 100;
      if (kunnatAmount) {
        polygonSerie = assoc("value", percentage, polygonSerie);
      } else {
        polygonSerie = dissoc("value", polygonSerie);
      }
      if (polygon) {
        let fillColor = "#dadada";
        // Ahvenanmaa must be hidden.
        if (id === "FI-01") {
          fillColor = "#ffffff";
        } else {
          if (percentage > 0 && percentage < 100) {
            fillColor = mix("#109F52", "#C8DCC3", 1 - percentage / 100);
          } else if (percentage === 100) {
            fillColor = "#109F52";
          }
          if (labelSeries) {
            labelSeries.disposeChildren();
            try {
              const label = labelSeries.mapImages.create();
              label.latitude = polygon.visualLatitude;
              label.longitude = polygon.visualLongitude;
              label.children.getIndex(0).text = `${Math.round(percentage)} %`;
            } catch (err) {
              console.warn(err);
            }
          }
        }
        polygon.fill = am4core.color(fillColor);
      }
      return percentage;
    },
    deactivate: (changeObjects = []) => {
      const changeObjectsForMunicipalities = values(
        mapObjIndexed(municipality => {
          const changeObj = find(
            propEq("anchor", municipality.getAnchor()),
            changeObjects
          );
          return municipality.getChangeObject(
            changeObj ? changeObj.properties : {},
            {
              isChecked: false
            }
          );
        }, municipalityInstances)
      ).filter(Boolean);

      const generatedProvinceChangeObject = isActive()
        ? _getRemovalChangeObj()
        : null;

      return flatten(
        [changeObjectsForMunicipalities, generatedProvinceChangeObject].filter(
          Boolean
        )
      );
    },
    getActiveMunicipalities: (changeObjects = []) => {
      return getActiveMunicipalities(changeObjects);
    },
    getAdditionChangeObj: isIndeterminate => {
      return getAdditionChangeObj(isIndeterminate);
    },
    getAnchor: () => {
      return getAnchor();
    },
    getChangeObject: (properties, targetProperties) => {
      return getChangeObject(properties, targetProperties);
    },
    getCode: () => {
      return code;
    },
    getId: () => {
      return id;
    },
    getMunicipalities: () => {
      return getMunicipalities();
    },
    getPercentageOfActiveMunicipalities: (changeObjects = []) => {
      return (
        (getActiveMunicipalities(changeObjects).length /
          getMunicipalities().length) *
        100
      );
    },
    getRemovalChangeObj: () => {
      return _getRemovalChangeObj();
    },
    getRemovalChangeObjForMunicipality: (koodiarvo, title) => {
      return getRemovalChangeObj(baseAnchor, id, koodiarvo, title);
    },
    getTitle: () => {
      return title;
    },
    initializedAs: () => {
      return province;
    },
    isActive: (changeObjects = []) => {
      return isActive(changeObjects);
    },
    /**
     * Function finds out if the province and its all municipalities are
     * active.
     */
    isFullyDeactive: (changeObjects = []) => {
      const deactiveMunicipalities = filter(municipality => {
        return municipality.isDeactive(changeObjects);
      }, municipalityInstances);
      return deactiveMunicipalities.length === getMunicipalities().length;
    },
    isMunicipalityActive: (koodiarvo, changeObjects = []) => {
      return isMunicipalityActive(koodiarvo, changeObjects);
    },
    removeMunicipality: (koodiarvo, changeObjects = []) => {
      const municipality = municipalityInstances[koodiarvo];
      let nextChangeObjects = changeObjects;
      if (!municipality) {
        console.warn("Couldn't find a municipality with koodiarvo", koodiarvo);
      } else {
        const anchor = municipality.getAnchor();
        nextChangeObjects = filter(
          changeObj => changeObj.anchor !== anchor,
          changeObjects
        );
        const changeObj = find(propEq("anchor", anchor), changeObjects) || {};
        // If municipality is active by default a new change object is needed.
        if (municipality.isActive()) {
          const nextChangeObj = municipality.getChangeObject(
            changeObj.properties,
            {
              isChecked: false
            }
          );
          nextChangeObjects = append(nextChangeObj, nextChangeObjects).filter(
            Boolean
          );
        }
      }
      /**
       * If all the municipalities will be deactive we need to deactivate the
       * province too.
       */
      const activeMunicipalities = getActiveMunicipalities(nextChangeObjects);
      if (!activeMunicipalities.length) {
        const anchor = getAnchor();
        const changeObj = find(propEq("anchor", anchor), changeObjects) || {};
        const provinceChangeObj = getChangeObject(changeObj.properties, {
          isChecked: false,
          isIndeterminate: false
        });
        if (provinceChangeObj) {
          nextChangeObjects = filter(
            compose(not, propEq("anchor", provinceChangeObj.anchor)),
            nextChangeObjects
          );
          nextChangeObjects = append(
            provinceChangeObj,
            nextChangeObjects
          ).filter(Boolean);
        } else {
          nextChangeObjects = filter(
            changeObj => changeObj.anchor !== anchor,
            nextChangeObjects
          );
        }
      }

      return nextChangeObjects;
    },
    setMap: map => {
      kartta = map;
      // Configure label series
      labelSeries = kartta.series
        ? kartta.series.push(new am4maps.MapImageSeries())
        : null;
      labelTemplate = labelSeries
        ? labelSeries.mapImages.template.createChild(am4core.Label)
        : null;
      if (labelTemplate) {
        labelTemplate.horizontalCenter = "middle";
        labelTemplate.verticalCenter = "middle";
        labelTemplate.fontSize = 14;
        labelTemplate.interactionsEnabled = false;
        labelTemplate.nonScaling = true;
      }
    },
    setPolygonSeries: _polygonSeries => {
      polygonSeries = _polygonSeries;
      polygon = polygonSeries ? polygonSeries.getPolygonById(id) : null;
    }
  };
}
