import { lensPath, sortBy, view } from "ramda";
import { Kielet } from "types";
import { LocaleUpper } from "enums";

/**
 *
 * @param kielet Taulukko, joka sisältää objekteja, joiden tyyppi on Kieli.
 * @param localeUpper LocaleUpper-tyyppiä oleva kielitieto (FI / SV).
 * @returns Palauttaa parametrinä annetun kielten taulukon järjestettynä kielten
 * nimien mukaan siten, että ensimmäisinä aakkosissa olevat kielet ovat taulukossa
 * ensimmäisinä.
 */
export const sortLanguagesByName = (kielet: Kielet, localeUpper: LocaleUpper) =>
  sortBy(view(lensPath(["metadata", localeUpper, "nimi"])), kielet);
