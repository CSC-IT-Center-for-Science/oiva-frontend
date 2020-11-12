import { getChangeObjByAnchor } from "components/02-organisms/CategorizedListRoot/utils";
import { getEnsisijaisetOpetuskieletOPHFromStorage } from "helpers/opetuskielet";
import { map, toUpper } from "ramda";

export default async function opetustehtavat(
  changeObjects = [],
  locale
) {
  const opetuskielet = await getEnsisijaisetOpetuskieletOPHFromStorage();
  const localeUpper = toUpper(locale);
  const anchorA = `opetuskielet.opetuskieli.ensisijaiset`;
  const anchorB = `opetuskielet.opetuskieli.toissijaiset`;
  const changeLangObj = getChangeObjByAnchor(anchorA, changeObjects);
  const addLangObj = getChangeObjByAnchor(anchorB, changeObjects);

  if (
    (changeLangObj && changeLangObj.properties) ||
    (addLangObj && addLangObj.properties)
  ) {
    let valitutKielet =
      changeLangObj.properties.value || addLangObj.properties.value;
    // lisätään toissijaiset kielet vain, jos on sekä ensi- että toissijaisia kieliä
    if (
      changeLangObj &&
      changeLangObj.properties &&
      addLangObj &&
      addLangObj.properties
    ) {
      valitutKielet = [].concat(
        changeLangObj.properties.value,
        addLangObj.properties.value
      );
    }

    return {
      anchor: "rajoitus",
      components: [
        {
          anchor: "opetuskielet",
          name: "Autocomplete",
          properties: {
            options: map(kieli => {
              return {
                label:
                  opetuskielet.filter(opetuskieli => {
                    return opetuskieli.koodiarvo === kieli.value;
                  })[0].metadata[localeUpper].nimi || kieli.label, // filtteröity lokalisoitu kielen nimi opetuskielten joukosta // tai osan ei pitäisi koskaan tulla, varmistus
                value: kieli.value
              };
            }, valitutKielet),
            value: ""
          }
        }
      ]
    };
  } else {
    return {
      anchor: "ei-valintamahdollisuutta",
      components: [
        {
          anchor: "teksti",
          name: "StatusTextRow",
          properties: {
            title: "Ei valintamahdollisuutta."
          }
        }
      ]
    };
  }
}
