import { map } from "ramda";
import localforage from "localforage";

export default async function getOppilaitokset(
  isReadOnly,
  osionData = [],
  locale,
  useMultiselect,
  inputId
) {
  const oppilaitokset = await localforage.getItem("oppilaitoksetByOid");

  if (oppilaitokset.length) {
    return [
      {
        anchor: "komponentti",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "oppilaitokset"
          },
          inputId,
          isMulti: useMultiselect,
          isReadOnly,
          options: map(oppilaitos => {
            return {
              label: oppilaitos.nimi[locale],
              value: oppilaitos.oid
            };
          }, oppilaitokset).filter(Boolean),
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
