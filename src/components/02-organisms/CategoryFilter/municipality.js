import { find, propEq, includes, values, mapObjIndexed, equals } from "ramda";

function Municipality(baseAnchor, municipality) {
  const {
    koodiarvo,
    maakuntaKey: provinceId,
    title
  } = municipality.properties.forChangeObject;
  const anchor = `${baseAnchor}.${provinceId}.kunnat.${koodiarvo}`;
  const { isChecked: isCheckedByDefault, name } = municipality.properties;

  function getChangeObject(currentChangeObjProps = {}, targetProperties = {}) {
    const originalProperties = municipality.properties;

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
                koodiarvo,
                provinceKey: provinceId
              }
            }
          )
        };
        return changeObj;
      }
    }
  }

  return {
    isActive: (changeObjects = []) => {
      const changeObj = find(propEq("anchor", anchor), changeObjects);
      return (
        (isCheckedByDefault && !changeObj) ||
        (changeObj && changeObj.properties.isChecked)
      );
    },
    isDeactive: (changeObjects = []) => {
      const changeObj = find(propEq("anchor", anchor), changeObjects);
      return !!(
        (!isCheckedByDefault && !changeObj) ||
        (changeObj && !changeObj.properties.isChecked)
      );
    },
    getAnchor: () => anchor,
    getChangeObject,
    getKoodiarvo: () => koodiarvo,
    getName: () => name,
    getRemovalChangeObject: () => {
      return {
        anchor,
        properties: {
          isChecked: false,
          isIndeterminate: false,
          metadata: {
            koodiarvo,
            maakuntaKey: provinceId,
            title
          }
        }
      };
    },
    getTitle: () => title
  };
}

export default Municipality;
