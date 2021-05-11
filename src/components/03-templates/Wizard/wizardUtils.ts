import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/app-routes";
import { Koulutusmuoto, Organisation } from "types";

/**
 * Muodostaa ja palauttaa polun (url-osoite) annettujen parametrien
 * perusteella. Polkua on tarkoitus käyttää Wizardin sulkemistoimintojen
 * yhteydessä siten, että käyttäjä ohjataan asianhallintasivun tilanteen-
 * mukaiseen näkymään.
 * @param role - Käyttäjän rooli.
 * @param locale - Käyttöliittymän kieli.
 * @param formatMessage - Funktio, jota käytetään lokalisoimiseen.
 * @param organisaatio - Organisaatio, jonka oid-tietoa käytetään
 *                       muodostettavassa polussa
 * @param koulutusmuoto - Koulutusmuoto-tyyppinen objekti.
 * @param uuid - Muutospyynnön UUID (ei pakollinen tieto).
 * @returns URL-osoite.
 */
export const getUrlOnClose = (
  role: string,
  locale: string,
  formatMessage: Function,
  organisaatio: Organisation,
  koulutusmuoto: Koulutusmuoto,
  uuid?: string
): string => {
  // Jos käyttäjän rooli on KJ, palautetaan polku, jota pitkin
  // pääsee koulutusmuoto huomioiden käyttäjän oman organisaation
  // järjestämislupa-asioihin.
  if (role === "KJ") {
    return localizeRouteKey(
      locale,
      AppRoute.Jarjestamislupaasiat,
      formatMessage,
      {
        id: organisaatio.oid,
        koulutusmuoto: koulutusmuoto.kebabCase
      }
    );
  } else {
    // Käyttäjän ollessa rooliltaan jokin muu kuin KJ, on kaksi
    // vaihtoehtoa: 1) Jos muutospyynnön UUID on käytettävissä eli
    // mikäli muutospyyntö on tallennettu, palautetaan polku, jota pitkin
    // pääsee Asian asiakirjat -näkymään kyseisen muutospyynnön kohdalle.
    if (uuid) {
      return `${localizeRouteKey(locale, AppRoute.Asia, formatMessage, {
        koulutusmuoto: koulutusmuoto.kebabCase,
        uuid
      })}?force=true`;
    } else {
      // Mikäli käyttäjä ei ole tallentanut muutospyyntöä tai mikäli UUID ei
      // ole jostain muusta syystä käytettävissä, palautetaan avoimiin
      // asiakirjoihin johtava polku.
      return `${localizeRouteKey(
        locale,
        AppRoute.AsianhallintaAvoimet,
        formatMessage,
        {
          koulutusmuoto: koulutusmuoto.kebabCase
        }
      )}?force=true`;
    }
  }
};
