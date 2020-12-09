import { map, mapObjIndexed, forEachObjIndexed } from "ramda";

function Country(provinces) {
  return {
    /**
     * Activates Finland's provinces and their municipalities.
     */
    activate: changeObjectsByProvince => {
      return map(province => {
        return province.activateFully(
          changeObjectsByProvince[province.getId()]
        );
      }, provinces);
    },
    /**
     * Updates map colors.
     */
    colorize: (changeObjectsByProvince = []) => {
      forEachObjIndexed(province => {
        province.colorize(changeObjectsByProvince[province.getId()]);
      }, provinces);
    },
    /**
     * Deactivates Finland's provinces and their municipalities.
     */
    deactivate: changeObjectsByProvince => {
      return map(province => {
        return province.deactivate(changeObjectsByProvince[province.getId()]);
      }, provinces);
    },
    /**
     * Returns true if the whole country is deactivate.
     */
    getPercentages: (changeObjectsByProvince = {}) => {
      const percentages = mapObjIndexed(province => {
        return province.getPercentageOfActiveMunicipalities(
          changeObjectsByProvince[province.getId()]
        );
      }, provinces);
      return percentages;
    }
  };
}

export default Country;
