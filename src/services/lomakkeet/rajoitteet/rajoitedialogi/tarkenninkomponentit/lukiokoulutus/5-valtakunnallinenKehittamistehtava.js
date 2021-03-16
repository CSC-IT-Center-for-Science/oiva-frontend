import { getLukioErityisetKoulutustehtavatFromStorage } from "helpers/lukioErityisetKoulutustehtavat/index";
import {
  compose,
  endsWith,
  filter,
  flatten,
  map,
  prop
} from "ramda";
import { getAnchorPart } from "utils/common";

export default async function getValtakunnallisetKehittamistehtavat(
  isReadOnly,
  osionData = [],
  locale,
  voidaankoValitaUseita,
  inputId
) {
  let valtakunnallisetKehittamistehtavat = filter(compose(endsWith('.valintaelementti'), prop('anchor')), osionData)

  if (valtakunnallisetKehittamistehtavat.length) {
    return [
      {
        anchor: "komponentti",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "valtakunnallisetKehittamistehtavat"
          },
          inputId,
          isMulti: voidaankoValitaUseita,
          isReadOnly,
          options: flatten(
            map(valtakunnallinenKehittamistehtava => {
              if (valtakunnallinenKehittamistehtava.properties.isChecked) {
                return {
                  value: `${getAnchorPart(
                    valtakunnallinenKehittamistehtava.anchor,
                    1
                  )}-${getAnchorPart(valtakunnallinenKehittamistehtava.anchor, 2)}`,
                  label: valtakunnallinenKehittamistehtava.properties.title
                };
              }

              return null;
            }, valtakunnallisetKehittamistehtavat).filter(Boolean)
          ),
          value: ""
        }
      }
    ];
  } else {
    return [
      {
        anchor: "teksti",
        name: "StatusTextRow",
        properties: {
          title: "Ei valintamahdollisuutta."
        }
      }
    ];
  }
}
