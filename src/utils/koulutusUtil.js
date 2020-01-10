import * as R from "ramda";

export function getDataForKoulutusList(
  koulutukset,
  locale,
  lupa = {},
  koodisto
) {
  const luvassaOlevatKoodiarvot = koodisto
    ? R.map(maarays => {
        return maarays.koodisto === koodisto ? maarays.koodiarvo : null;
      }, lupa.maaraykset).filter(Boolean)
    : [];

  let isInLupaTrueFound = false;

  return {
    items: R.addIndex(R.map)((koulutus, index) => {
      const isInLupa = !!(
        koodisto && R.includes(koulutus.koodiArvo, luvassaOlevatKoodiarvot)
      );

      if (isInLupa) {
        isInLupaTrueFound = true;
      }
      return {
        code: koulutus.koodiArvo,
        isInLupa,
        isReasoningRequired: index !== koulutukset.length - 1,
        shouldBeChecked:
          isInLupa ||
          (koodisto && !isInLupaTrueFound && index === koulutukset.length - 1),
        koodisto: koulutus.koodisto,
        metadata: koulutus.metadata,
        title:
          R.find(m => {
            return m.kieli === locale;
          }, koulutus.metadata).nimi || "[Koulutuksen otsikko tähän]"
      };
    }, koulutukset)
  };
}
