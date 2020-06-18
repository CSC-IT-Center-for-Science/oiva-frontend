import { isAdded, isRemoved, isInLupa } from "../../../css/label";
import { toUpper, filter, map } from "ramda";

function getModificationForm(
  koulutusala,
  koulutustyypit,
  title,
  tutkinnotByKoulutustyyppi,
  locale
) {
  const localeUpper = toUpper(locale);
  const currentDate = new Date();
  return map(koulutustyyppi => {
    const tutkinnot = tutkinnotByKoulutustyyppi[koulutustyyppi.koodiarvo];
    if (tutkinnot) {
      return {
        anchor: koulutustyyppi.koodiarvo,
        meta: {
          areaCode: koulutusala.koodiarvo,
          title
        },
        code: koulutustyyppi.koodiarvo,
        title: koulutustyyppi.metadata[localeUpper].nimi,
        categories: map(tutkinto => {
          const osaamisalatWithoutMaarays = filter(
            osaamisala => !osaamisala.maarays,
            tutkinto.osaamisalat
          );
          return new Date(tutkinto.voimassaAlkuPvm) < currentDate
            ? {
                anchor: tutkinto.koodiarvo,
                components: [
                  {
                    anchor: "tutkinto",
                    name: "CheckboxWithLabel",
                    properties: {
                      code: tutkinto.koodiarvo,
                      title: tutkinto.metadata[localeUpper].nimi,
                      labelStyles: {
                        addition: isAdded,
                        removal: isRemoved,
                        custom: Object.assign(
                          {},
                          !!tutkinto.maarays ? isInLupa : {}
                        )
                      },
                      isChecked: !!tutkinto.maarays,
                      isIndeterminate:
                        osaamisalatWithoutMaarays.length !==
                        tutkinto.osaamisalat.length
                    }
                  }
                ],
                categories: map(osaamisala => {
                  return {
                    anchor: osaamisala.koodiarvo,
                    components: [
                      {
                        anchor: "osaamisala",
                        name: "CheckboxWithLabel",
                        properties: {
                          code: osaamisala.koodiarvo,
                          title: osaamisala.metadata[localeUpper].nimi,
                          labelStyles: {
                            addition: isAdded,
                            removal: isRemoved,
                            custom: Object.assign(
                              {},
                              !osaamisala.maarays ? isInLupa : {}
                            )
                          },
                          isChecked: !!tutkinto.maarays && !osaamisala.maarays
                        }
                      }
                    ]
                  };
                }, tutkinto.osaamisalat)
              }
            : null;
        }, tutkinnot).filter(Boolean)
      };
    }
    return null;
  }, koulutustyypit).filter(Boolean);
}

export default function getTutkinnotLomake(action, data, isReadOnly, locale) {
  switch (action) {
    case "modification":
      return getModificationForm(
        data.koulutusala,
        data.koulutustyypit,
        data.title,
        data.tutkinnotByKoulutustyyppi,
        locale
      );
    default:
      return [];
  }
}
