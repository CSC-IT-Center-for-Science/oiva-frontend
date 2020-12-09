import {
  getKuljettajienJatkokoulutuslomake,
  getKuljettajienPeruskoulutuslomake
} from "./perustelut/kuljettajakoulutukset";
import { getTaloudellisetlomake } from "./taloudelliset";
import { append, path } from "ramda";
import getATVKoulutuksetPerustelulomake from "./perustelut/koulutukset/atv-koulutukset";
import getValmentavatKoulutuksetPerustelulomake from "./perustelut/koulutukset/valmentavatKoulutukset";
import { setLocale } from "./i18n-config";
import { getCheckboxes } from "./perustelut/muutostarpeet";
import getToimintaaluePerustelulomake from "./perustelut/toiminta-alue";
import getOpetuskieletPerustelulomake from "./perustelut/opetuskielet";
import getKuljettajakoulutuslomake from "./koulutukset/kuljettajakoulutukset";
import getTyovoimakoulutuslomake from "./koulutukset/tyovoimakoulutukset";
import getATVKoulutuksetLomake from "./koulutukset/atvKoulutukset";
import getValmentavatKoulutuksetLomake from "./koulutukset/valmentavatKoulutukset";
import getTutkinnotPerustelulomake from "./perustelut/tutkinnot/";
import getTutkinnotLomake from "./tutkinnot";
import getOpetuskieletLomake from "./kielet/opetuskielet";
import getTutkintokieletLomake from "./kielet/tutkintokielet";
import { getToimintaaluelomake } from "./toimintaalue";
import getOpiskelijavuodetLomake from "./opiskelijavuodet";
import getPerustelutLiitteetlomake from "./perustelut/liitteet";
import getYhteenvetoLiitteetLomake from "./yhteenveto/liitteet";
import getTutkintokieletPerustelulomake from "./perustelut/kielet/tutkintokielet";
import getMuutPerustelulomake from "./perustelut/muutMuutokset";
import getTyovoimakoulutuksetPerustelulomake from "./perustelut/koulutukset/tyovoimakoulutukset";
import getSisaoppilaitosOpiskelijavuodetPerustelulomake from "./perustelut/opiskelijavuodet/sisaoppilaitos";
import getVahimmaisopiskelijavuodetPerustelulomake from "./perustelut/opiskelijavuodet/vahimmais";
import getVaativaTukiOpiskelijavuodetPerustelulomake from "./perustelut/opiskelijavuodet/vaativa";
import getYhteenvetoYleisetTiedotLomake from "./yhteenveto/yleisetTiedot";
import getTopThree from "./esittelija";
import { opetusJotaLupaKoskee } from "./esi-ja-perusopetus/1-opetusJotaLupaKoskee";
import getPaatoksenTiedot from "./esi-ja-perusopetus/0-paatoksenTiedot";
import { getOpetuskieletOPHLomake } from "./esi-ja-perusopetus/3-opetuskielet";
import { opetuksenJarjestamismuoto } from "./esi-ja-perusopetus/4-opetuksenJarjestamismuoto";
import { erityisetKoulutustehtavat } from "./esi-ja-perusopetus/5-erityisetKoulutustehtavat";
import { muutEhdot } from "./esi-ja-perusopetus/7-muutEhdot";
import { opiskelijamaarat } from "./esi-ja-perusopetus/6-opiskelijamaarat";
import { opetustaAntavatKunnat } from "./esi-ja-perusopetus/2-opetustaAntavatKunnat";
import { rajoitteet } from "./esi-ja-perusopetus/rajoitteet/9-rajoitteet";
import { rajoitelomake } from "./esi-ja-perusopetus/rajoitteet/rajoite";
import { getMuutLaajennettu } from "./ammatillinenKoulutus/5-muut/laajennettu";
import { getMuutVaativaTuki } from "./ammatillinenKoulutus/5-muut/vaativaTuki";
import { getMuutSisaoppilaitos } from "./ammatillinenKoulutus/5-muut/sisaoppilaitos";
import { getMuutVankila } from "./ammatillinenKoulutus/5-muut/vankila";
import { getMuutUrheilu } from "./ammatillinenKoulutus/5-muut/urheilu";
import { getMuutYhteistyo } from "./ammatillinenKoulutus/5-muut/yhteistyo";
import { getMuutYhteistyosopimus } from "./ammatillinenKoulutus/5-muut/yhteistyosopimus";
import { getMuutSelvitykset } from "./ammatillinenKoulutus/5-muut/selvitykset";
import { getMuutMuuMaarays } from "./ammatillinenKoulutus/5-muut/muuMaarays";

// Esi- ja perusopetuksen esikatselulomakkeet
import { previewOfOpetusJotaLupaKoskee } from "./esi-ja-perusopetus/esikatselu/1-opetusJotaLupaKoskee";
import { previewOfOpetuskielet } from "./esi-ja-perusopetus/esikatselu/3-opetuskielet";
import { previewOfOpetuksenJarjestamismuoto } from "./esi-ja-perusopetus/esikatselu/4-opetuksenJarjestamismuoto";
import { previewOfErityisetKoulutustehtavat } from "./esi-ja-perusopetus/esikatselu/5-erityisetKoulutustehtavat";
import { previewOfOpiskelijamaarat } from "./esi-ja-perusopetus/esikatselu/6-opiskelijamaarat";
import { previewOfMuutEhdot } from "./esi-ja-perusopetus/esikatselu/7-muutEhdot";
import { previewOfOpetustaAntavaKunnat } from "./esi-ja-perusopetus/esikatselu/2-opetustaAntavatKunnat";

/**
 * LOMAKEPALVELU
 */
const lomakkeet = {
  /**
   * AMMATILLINEN KOULUTUS
   */
  ammatillinenKoulutus: {
    muut: {
      laajennettu: {
        modification: (data, booleans, locale) =>
          getMuutLaajennettu(data, booleans, locale)
      },
      muuMaarays: {
        modification: (data, booleans, locale) =>
          getMuutMuuMaarays(data, booleans, locale)
      },
      sisaoppilaitos: {
        modification: (data, booleans, locale) =>
          getMuutSisaoppilaitos(data, booleans, locale)
      },
      urheilu: {
        modification: (data, booleans, locale) =>
          getMuutUrheilu(data, booleans, locale)
      },
      selvitykset: {
        modification: (data, booleans, locale) =>
          getMuutSelvitykset(data, booleans, locale)
      },
      vaativaTuki: {
        modification: (data, booleans, locale) =>
          getMuutVaativaTuki(data, booleans, locale)
      },
      vankila: {
        modification: (data, booleans, locale) =>
          getMuutVankila(data, booleans, locale)
      },
      yhteistyo: {
        modification: (data, booleans, locale) =>
          getMuutYhteistyo(data, booleans, locale)
      },
      yhteistyosopimus: {
        modification: (data, booleans, locale) =>
          getMuutYhteistyosopimus(data, booleans, locale)
      }
    }
  },

  // Wizard page 1 forms
  tutkinnot: {
    modification: (data, booleans, locale) =>
      getTutkinnotLomake("modification", data, booleans, locale)
  },
  koulutukset: {
    atvKoulutukset: {
      // atv = ammatilliseen tehtävään valmistavat
      modification: (data, booleans) =>
        getATVKoulutuksetLomake("modification", data, booleans)
    },
    kuljettajakoulutukset: {
      modification: (data, booleans) =>
        getKuljettajakoulutuslomake("modification", data, booleans)
    },
    tyovoimakoulutukset: {
      modification: (data, booleans) =>
        getTyovoimakoulutuslomake("modification", data, booleans)
    },
    valmentavatKoulutukset: {
      modification: (data, booleans) =>
        getValmentavatKoulutuksetLomake("modification", data, booleans)
    }
  },
  kielet: {
    opetuskielet: {
      modification: (data, booleans, locale) =>
        getOpetuskieletLomake("modification", data, booleans, locale)
    },
    tutkintokielet: {
      modification: (data, booleans, locale) =>
        getTutkintokieletLomake("modification", data, booleans, locale)
    }
  },
  toimintaalue: {
    modification: (data, booleans, locale, changeObjects, functions) =>
      getToimintaaluelomake(data, booleans, locale, changeObjects, functions)
  },
  opiskelijavuodet: {
    modification: (data, booleans, locale) =>
      getOpiskelijavuodetLomake(data, booleans, locale)
  },

  // Wizard page 2 forms
  perustelut: {
    kielet: {
      opetuskielet: {
        reasoning: (data, booleans, locale) =>
          getOpetuskieletPerustelulomake("reasoning", data, booleans, locale)
      },
      tutkintokielet: {
        reasoning: (data, booleans, locale) =>
          getTutkintokieletPerustelulomake("reasoning", data, booleans, locale)
      }
    },
    koulutukset: {
      atvKoulutukset: {
        addition: (data, booleans, locale, changeObjects, prefix) =>
          getATVKoulutuksetPerustelulomake(
            "addition",
            data,
            booleans,
            locale,
            prefix
          ),
        removal: (data, booleans, locale, changeObjects, prefix) =>
          getATVKoulutuksetPerustelulomake(
            "removal",
            data,
            booleans,
            locale,
            prefix
          )
      },
      kuljettajakoulutukset: {
        jatkokoulutus: {
          addition: (data, booleans) =>
            getKuljettajienJatkokoulutuslomake("addition", data, booleans),
          removal: (data, booleans, locale, changeObjects, prefix) =>
            getKuljettajienJatkokoulutuslomake(
              "removal",
              data,
              booleans,
              prefix
            )
        },
        peruskoulutus: {
          addition: (data, booleans) =>
            getKuljettajienPeruskoulutuslomake("addition", data, booleans),
          removal: (data, booleans, locale, changeObjects, prefix) =>
            getKuljettajienPeruskoulutuslomake(
              "removal",
              data,
              booleans,
              prefix
            )
        }
      },
      tyovoimakoulutukset: {
        addition: (data, booleans, locale) =>
          getTyovoimakoulutuksetPerustelulomake(
            "addition",
            data,
            booleans,
            locale
          ),
        removal: (data, booleans, locale, changeObjects, prefix) =>
          getTyovoimakoulutuksetPerustelulomake(
            "removal",
            data,
            booleans,
            locale,
            prefix
          )
      },
      valmentavat: {
        addition: (data, booleans, locale, changeObjects, prefix) =>
          getValmentavatKoulutuksetPerustelulomake(
            "addition",
            data,
            booleans,
            prefix
          ),
        removal: (data, booleans, locale, changeObjects, prefix) =>
          getValmentavatKoulutuksetPerustelulomake(
            "removal",
            data,
            booleans,
            prefix
          )
      }
    },
    liitteet: {
      reasoning: (data, booleans) =>
        getPerustelutLiitteetlomake("reasoning", booleans)
    },
    muutostarpeet: {
      checkboxes: (data, booleans, locale) =>
        getCheckboxes(data.checkboxItems, locale, booleans)
    },
    toimintaalue: {
      reasoning: (data, booleans, locale, changeObjects, prefix) =>
        getToimintaaluePerustelulomake(
          "reasoning",
          data,
          booleans,
          locale,
          prefix
        )
    },
    tutkinnot: {
      reasoning: (data, booleans, locale, changeObjects, prefix) =>
        getTutkinnotPerustelulomake(
          "reasoning",
          data,
          booleans,
          locale,
          changeObjects,
          prefix
        )
    },
    opiskelijavuodet: {
      sisaoppilaitos: {
        reasoning: (data, booleans) =>
          getSisaoppilaitosOpiskelijavuodetPerustelulomake(
            "reasoning",
            data,
            booleans
          )
      },
      vaativatuki: {
        reasoning: (data, booleans) =>
          getVaativaTukiOpiskelijavuodetPerustelulomake(
            "reasoning",
            data,
            booleans
          )
      },
      vahimmais: {
        reasoning: (data, booleans, locale) =>
          getVahimmaisopiskelijavuodetPerustelulomake(
            "reasoning",
            data,
            booleans,
            locale
          )
      }
    },
    muut: {
      reasoning: (data, booleans, locale) =>
        getMuutPerustelulomake("reasoning", data, booleans, locale)
    }
  },
  taloudelliset: {
    yleisettiedot: (data, booleans) =>
      getTaloudellisetlomake("yleisettiedot", data, booleans),
    investoinnit: (data, booleans) =>
      getTaloudellisetlomake("investoinnit", data, booleans),
    tilinpaatostiedot: (data, booleans) =>
      getTaloudellisetlomake("tilinpaatostiedot", data, booleans),
    liitteet: (data, booleans) =>
      getTaloudellisetlomake("liitteet", data, booleans)
  },
  yhteenveto: {
    liitteet: {
      modification: () => getYhteenvetoLiitteetLomake("modification")
    },
    yleisetTiedot: {
      modification: (data, booleans) =>
        getYhteenvetoYleisetTiedotLomake("modification", data, booleans)
    }
  },

  // Esittelija
  esittelija: {
    topThree: {
      addition: (data, booleans, locale, changeObjects) =>
        getTopThree(data, booleans, locale, changeObjects)
    }
  },

  // Esi- ja perusopetus
  esiJaPerusopetus: {
    erityisetKoulutustehtavat: {
      modification: (data, booleans, locale, changeObjects, functions) =>
        erityisetKoulutustehtavat(
          data,
          booleans,
          locale,
          changeObjects,
          functions
        ),
      preview: (data, booleans, locale, changeObjects) =>
        previewOfErityisetKoulutustehtavat(
          data,
          booleans,
          locale,
          changeObjects
        )
    },
    muutEhdot: {
      modification: (data, booleans, locale, changeObjects, functions) =>
        muutEhdot(data, booleans, locale, changeObjects, functions),
      preview: (data, booleans, locale, changeObjects) =>
        previewOfMuutEhdot(data, booleans, locale, changeObjects)
    },
    opetuksenJarjestamismuodot: {
      modification: (data, booleans, locale) =>
        opetuksenJarjestamismuoto(data, booleans, locale),
      preview: (data, booleans, locale, changeObjects) =>
        previewOfOpetuksenJarjestamismuoto(
          data,
          booleans,
          locale,
          changeObjects
        )
    },
    opetusJotaLupaKoskee: {
      modification: (data, booleans, locale, changeObjects) =>
        opetusJotaLupaKoskee(data, booleans, locale, changeObjects),
      preview: (data, booleans, locale, changeObjects) =>
        previewOfOpetusJotaLupaKoskee(data, booleans, locale, changeObjects)
    },
    opetuskielet: {
      modification: (data, booleans, locale, changeObjects) =>
        getOpetuskieletOPHLomake(data, booleans, locale, changeObjects),
      preview: (data, booleans, locale, changeObjects) =>
        previewOfOpetuskielet(data, booleans, locale, changeObjects)
    },
    opiskelijamaarat: {
      modification: (data, booleans) => opiskelijamaarat(data, booleans),
      preview: (data, booleans, locale, changeObjects) =>
        previewOfOpiskelijamaarat(data, booleans, locale, changeObjects)
    },
    paatoksenTiedot: {
      addition: (data, booleans, locale, changeObjects) =>
        getPaatoksenTiedot(data, booleans, locale, changeObjects)
    },
    opetustaAntavatKunnat: {
      modification: (data, booleans, locale, changeObjects, functions) =>
        opetustaAntavatKunnat(data, booleans, locale, changeObjects, functions),
      preview: (data, booleans, locale, changeObjects, functions) =>
        previewOfOpetustaAntavaKunnat(
          data,
          booleans,
          locale,
          changeObjects,
          functions
        )
    },
    rajoite: {
      addition: (data, booleans, locale, changeObjects, functions) =>
        rajoitelomake(data, booleans, locale, changeObjects, functions)
    },
    rajoitteet: {
      addition: (data, booleans, locale, changeObjects, functions) =>
        rajoitteet(data, booleans, locale, changeObjects, functions)
    }
  }
};

export async function getLomake(
  mode = "addition",
  changeObjects = [],
  data = {},
  functions = {},
  booleans,
  locale,
  _path = [],
  prefix
) {
  // This defines the language of the requested form.
  setLocale(locale);
  const fn = path(append(mode, _path), lomakkeet);
  const lomake = fn
    ? await fn(data, booleans, locale, changeObjects, functions, prefix)
    : [];

  return lomake;
}
