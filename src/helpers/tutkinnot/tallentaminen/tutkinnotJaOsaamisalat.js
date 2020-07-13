import {
  flatten,
  map,
  prop,
  compose,
  filter,
  includes,
  find,
  propEq,
  equals,
  append,
  assocPath,
  startsWith,
  endsWith,
  difference,
  path
} from "ramda";
import { getAnchorInit, getAnchorPart } from "../../../utils/common";

/**
 * Luo backendin tarvitsemat muutosobjektit tutkintojen ja osaamisalojen
 * osalta.
 *
 * @param {object} tutkinto
 * @param {array} changeObjects
 * @param {object} kohde
 * @param {array} maaraystyypit
 * @param {object} locale
 */
export function createBEOofTutkinnotJaOsaamisalat(
  tutkinto,
  changeObjects,
  kohde,
  maaraystyypit,
  locale
) {
  const tutkintoAnchor = `tutkinnot_${tutkinto.koulutusalakoodiarvo}.${tutkinto.koulutustyyppikoodiarvo}.${tutkinto.koodiarvo}`;
  let changes = filter(
    compose(startsWith(tutkintoAnchor), prop("anchor")),
    changeObjects.tutkinnotJaOsaamisalat.muutokset
  );

  /**
   * Mikäli tarkasteltavaan tutkintoon eikä sen alla oleviin osaamisaloihin ole kohdistunut muutoksia,
   * tarkastelua ei tarvitse tehdä
   */
  if (changes.length === 0) {
    return null;
  }

  const tutkintoChangeObj = find(
    compose(endsWith("tutkinto"), prop("anchor")),
    changes
  );
  const osaamisalaChangeObjs = difference(changes, [tutkintoChangeObj]);

  /**
   * Tutkinto kuuluu lupaan, jos sillä on määräys.
   */
  const isTutkintoInLupa = !!tutkinto.maarays;
  const isTutkintopoisto =
    isTutkintoInLupa &&
    tutkintoChangeObj &&
    !tutkintoChangeObj.properties.isChecked;

  /**
   * Ainoa asia, jonka vuoksi on tarpeen luoda tai päivittää muutosobjekti,
   * on se, että tutkinto on joko aktivoitu tai deaktivoitu eli se ollaan
   * joko lisäämässä lupaan tai poistamassa luvasta.
   */
  const isTutkinnonMuutosobjektiNeeded =
    tutkintoChangeObj &&
    tutkintoChangeObj.properties.isChecked !== isTutkintoInLupa;

  const anchorInit = tutkintoChangeObj
    ? getAnchorInit(tutkintoChangeObj.anchor)
    : "";

  /**
   * Käyttäjälle tarjotaan mahdollisuutta perustella muutokset.
   * Perustelut ovat omia frontin puolen muutosobjektejaan, jotka
   * liitetään osaksi muodostettavaa - backendin kaipaamaa -
   * muutosobjektia.
   */
  const perustelut = filter(
    compose(includes(anchorInit), prop("anchor")),
    changeObjects.tutkinnotJaOsaamisalat.perustelut
  );

  /**
   * Mahdollinen tutkintomuutos on paikallaan määritellä muokattavana
   * objektina, koska siihen on myöhemmässä vaiheessa tarkoitus liittää
   * osaamisaloja koskevat käyttöliittymäpuolen muutosobjektit.
   */
  let tutkintomuutos = isTutkinnonMuutosobjektiNeeded
    ? {
        kohde,
        koodiarvo: tutkinto.koodiarvo,
        koodisto: tutkinto.koodisto.koodistoUri,
        kuvaus: tutkinto.metadata[locale].kuvaus,
        maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
        meta: {
          changeObjects: flatten([[tutkintoChangeObj], perustelut]),
          nimi: tutkinto.metadata[locale].nimi,
          koulutusala: tutkinto.koulutusalaKoodiarvo,
          koulutustyyppi: tutkinto.koulutustyyppiKoodiarvo,
          perusteluteksti: "", // TODO: Täydennä oikea perusteluteksti
          muutosperustelukoodiarvo: [] // Tarvitaanko tätä oikeasti?
        },
        nimi: tutkinto.metadata[locale].nimi,
        tila: tutkintoChangeObj.properties.isChecked ? "LISAYS" : "POISTO"
      }
    : null;

  if (!!tutkintomuutos) {
    // GenratedId on tarpeellinen vain lisättäessä tutkintoa lupaan.
    if (tutkintomuutos.tila === "LISAYS") {
      tutkintomuutos.generatedId = tutkintoChangeObj.properties.isChecked
        ? tutkintoChangeObj.anchor
        : undefined;
    }
    // Jos tutkinto kuuluu lupaan, asetetaan määräyksen uuid
    if (isTutkintoInLupa) {
      tutkintomuutos.maaraysUuid = tutkinto.maarays.uuid;
    }
  }

  /**
   * Seuraavaksi on käytävä läpi tarkasteltavan tutkinnon osaamisalat
   * ja tarkistettava, onko niihin kohdistettu muutoksia.
   */
  const osaamisalamuutokset = map(osaamisala => {
    const isOsaamisalaRajoiteInLupa = !!osaamisala.maarays;
    let osaamisalamuutos = null;

    const osaamisalaChangeObj = find(changeObj => {
      return equals(getAnchorPart(changeObj.anchor, 3), osaamisala.koodiarvo);
    }, osaamisalaChangeObjs);

    /**
     * OSAAMISALARAJOITTEEN LISÄÄMINEN
     *
     * Rajoite täytyy lisätä, jos tutkintoa ei olla poistamassa ja jompi kumpi seuraavista kohdista
     * pitää paikkansa:
     *
     * 1. Tutkinto lisätään lupaan ja osaamisalaa ei ole valittu
     * 2. Osaamisala on valittu luvassa, mutta osaamisala poistetaan
     **/
    if (!isOsaamisalaRajoiteInLupa) {
      if (
        !isTutkintopoisto &&
        ((!osaamisalaChangeObj && !isTutkintoInLupa) ||
          (osaamisalaChangeObj && !osaamisalaChangeObj.properties.isChecked))
      ) {
        // Luodaan LISÄYS
        osaamisalamuutos = {
          generatedId: osaamisalaChangeObj
            ? getAnchorInit(osaamisalaChangeObj.anchor)
            : `osaamisala-${Math.random()}`,
          kohde,
          koodiarvo: osaamisala.koodiarvo,
          koodisto: osaamisala.koodisto.koodistoUri,
          kuvaus: osaamisala.metadata[locale].kuvaus,
          maaraystyyppi: find(propEq("tunniste", "RAJOITE"), maaraystyypit),
          // maaraysUuid,
          meta: {
            changeObjects: flatten([[osaamisalaChangeObj], perustelut]).filter(
              Boolean
            ),
            nimi: osaamisala.metadata[locale].nimi,
            koulutusala: tutkinto.koulutusalaKoodiarvo,
            koulutustyyppi: tutkinto.koulutustyyppiKoodiarvo,
            perusteluteksti: "", // TODO: Täydennä oikea perusteluteksti
            muutosperustelukoodiarvo: []
          },
          parentMaaraysUuid: path(["maarays", "uuid"], tutkinto),
          nimi: osaamisala.metadata[locale].nimi,
          tila: "LISAYS"
        };

        /**
         * Jos ollaan lisäämässä uutta tutkintoa, tulee osaamisalan sen
         * osaamisalan parent-propertyn viitata tutkinnon generatedId-
         * propertyyn.
         **/
        if (!isTutkintoInLupa && tutkintomuutos) {
          osaamisalamuutos.parent = tutkintomuutos.generatedId;
        }
      }
    } else {
      /**
       * OSAAMISALARAJOITTEEN POISTAMINEN
       *
       * Rajoite täytyy poistaa, mikäli jompi kumpi seuraavista kohdista
       * pitää paikkansa:
       *
       * 1. Rajoite on olemassa ja tutkinto poistetaan luvalta (Osaamisalarajoitteet poistuisivat joka tapauksessa
       *    tutkinnon myötä, mutta selvennyksen vuoksi muodostetaan myös näistä muutokset)
       * 2. Rajoite on olemassa ja osaamisala asetetaan aktiiviseksi
       **/
      if (
        isOsaamisalaRajoiteInLupa &&
        ((!osaamisalaChangeObj && isTutkintopoisto) ||
          (osaamisalaChangeObj && osaamisalaChangeObj.properties.isChecked))
      ) {
        // Luodaan POISTO
        osaamisalamuutos = {
          kohde,
          koodiarvo: osaamisala.koodiarvo,
          koodisto: osaamisala.koodisto.koodistoUri,
          kuvaus: osaamisala.metadata[locale].kuvaus,
          maaraystyyppi: find(propEq("tunniste", "RAJOITE"), maaraystyypit),
          maaraysUuid: osaamisala.maarays.uuid,
          meta: {
            changeObjects: flatten([[osaamisalaChangeObj], perustelut]).filter(
              Boolean
            ),
            nimi: osaamisala.metadata[locale].nimi,
            koulutusala: tutkinto.koulutusalaKoodiarvo,
            koulutustyyppi: tutkinto.koulutustyyppiKoodiarvo,
            perusteluteksti: "", // TODO: Täydennä oikea perusteluteksti
            muutosperustelukoodiarvo: []
          },
          nimi: osaamisala.metadata[locale].nimi,
          parentMaaraysUuid: tutkinto.maarays.uuid,
          tila: "POISTO"
        };
      }
    }

    /**
     * Jos osaamisalamuutosta ei muodostettu, tarkoittaa se sitä, ettei
     * frontin muutosobjektia ole vielä tallennettu metadataan.
     **/
    if (!osaamisalamuutos && !!tutkintomuutos && !!osaamisalaChangeObj) {
      // Lisätään frontin muutosbjekti tutkintomuutoksen metadataan
      tutkintomuutos = assocPath(
        ["meta", "changeObjects"],
        append(osaamisalaChangeObj, tutkintomuutos.meta.changeObjects),
        tutkintomuutos
      );
    }

    /**
     * Jos ei ole tutkintoon kohdistuu fronttimuutos, jonka pohjalta ei
     * generoitu backend-muutosta, on fronttimuutos tallennettava johonkin,
     * jotta käyttöliittymän tila osataan tutkinnonkin osalta näyttää
     * ladattaessa oikein. Tallennetaan tutkinnon fronttimuutos osaksi
     * osaamisalamuutoksen metatietoja.
     **/
    if (!tutkintomuutos && !!osaamisalamuutos) {
      osaamisalamuutos = assocPath(
        ["meta", "changeObjects"],
        append(tutkintoChangeObj, osaamisalamuutos.meta.changeObjects),
        osaamisalamuutos
      );
    }

    return osaamisalamuutos;
  }, tutkinto.osaamisalat).filter(Boolean);

  return append(tutkintomuutos, osaamisalamuutokset);
}
