import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { API_BASE_URL } from "modules/constants";
import Loading from "modules/Loading";
import {
  assoc,
  find,
  filter,
  groupBy,
  head,
  includes,
  isEmpty,
  map,
  mapObjIndexed,
  omit,
  path,
  prop,
  propEq,
  sortBy,
  test,
  toUpper
} from "ramda";
import { initializeTutkinnot } from "helpers/tutkinnot";
import localforage from "localforage";
import { backendRoutes } from "stores/utils/backendRoutes";
import { useLocation, useParams } from "react-router-dom";
import { initializeMaakunta } from "helpers/maakunnat";
import {
  filterEnsisijaisetOpetuskieletOPH,
  filterToissijaisetOpetuskieletOPH,
  initializeKieli
} from "helpers/kielet";
import { sortLanguages } from "utils/kieliUtil";
import { initializeKoulutusala } from "helpers/koulutusalat";
import { initializeKoulutustyyppi } from "helpers/koulutustyypit";
import { initializeMuu } from "helpers/muut";
import { initializeKoulutus } from "helpers/koulutukset";
import { initializeOpetuskielet } from "helpers/opetuskielet";
import { initializeOpetustehtavat } from "helpers/opetustehtavat";
import { initializeOpetuksenJarjestamismuodot } from "helpers/opetuksenJarjestamismuodot";
import { initializePOErityisetKoulutustehtavat } from "helpers/poErityisetKoulutustehtavat";
import { initializePOMuutEhdot } from "helpers/poMuutEhdot";
import { initializeLisatiedot } from "helpers/lisatiedot";
import { initializeKunta } from "helpers/kunnat";
import { initializeLisamaare } from "helpers/kujalisamaareet";
import { sortArticlesByHuomioitavaKoodi } from "services/lomakkeet/utils";

const acceptJSON = {
  headers: { Accept: "application/json" }
};

/**
 * Erittäin harvoin muuttuvat tiedot noudetaan backendistä, miiäli tietoja
 * ei ole noudettu tai jos edellisestä noutokerrasta on kulunut muuttujan
 * minimumTimeBetweenFetchingInSeconds ilmaisema aika.
 */
const minimumTimeBetweenFetchingInMinutes = 60;

export const fetchJSON = async path => {
  const response = await fetch(`${API_BASE_URL}/${path}`, acceptJSON);
  let result = {
    fetchedAt: new Date(),
    data: response.ok ? await response.json() : null
  };
  result = !response.ok ? assoc("error", !response.ok, result) : result;
  await localforage.setItem(path, result);
  return result.data;
};

export const getRaw = async (
  key,
  path,
  keys,
  _minimumTimeBetweenFetchingInMinutes = minimumTimeBetweenFetchingInMinutes
) => {
  if (includes(key, keys) || isEmpty(keys)) {
    const stored = await localforage.getItem(path);
    return stored &&
      (new Date() - stored.fetchedAt) / 1000 / 60 <
        _minimumTimeBetweenFetchingInMinutes
      ? stored.data
      : await fetchJSON(path);
  }
};

/**
 * Funktio noutaa sovelluksen tarvitseman pohjadatan, kuten kunnat, maakunnat,
 * kielet ja määräystyypit. Nämä ovat yleistä dataa, jota käytetään mm.
 * lomakkeita ja listauksia muodostettaessa. Lupa noudetaan y-tunnusta käyttäen
 * ja sen sisältämiä määräyksiä hyödynnetään parsittaessa pohjadataa
 * tarvittaessa paremmin sovellusta palvelevaan muotoon.
 *
 * @param keys
 * @param {string} locale - fi / sv
 * @param lupaUuid
 * @param {string} ytunnus
 * @param koulutustyyppi
 * @param oppilaitostyyppi
 */
const fetchBaseData = async (
  keys,
  locale,
  lupaUuid,
  ytunnus,
  koulutustyyppi,
  oppilaitostyyppi
) => {
  const localeUpper = toUpper(locale);
  /**
   * Raw-objekti sisältää backendiltä tulevan datan muokkaamattomana.
   */
  const raw = {
    ajalla: await getRaw("ajalla", backendRoutes.ajalla.path, keys),
    elykeskukset: await getRaw(
      "elykeskukset",
      backendRoutes.elykeskukset.path,
      keys
    ),
    kielet: await getRaw("kielet", backendRoutes.kielet.path, keys),
    kohteet: await getRaw(
      "kohteet",
      `${backendRoutes.kohteet.path}${
        koulutustyyppi ? "?koulutustyyppi=" + koulutustyyppi : ""
      }`,
      keys
    ),
    lisatiedot: await getRaw(
      "lisatietoja",
      backendRoutes.lisatietoja.path,
      keys,
      backendRoutes.lisatietoja.minimumTimeBetweenFetchingInMinutes
    ),
    lupaByUuid: lupaUuid
      ? await getRaw(
          "lupaByUuid",
          `${backendRoutes.lupaByUuid.path}${lupaUuid}?with=all&useKoodistoVersions=false`,
          keys,
          backendRoutes.lupaByUuid.minimumTimeBetweenFetchingInMinutes
        )
      : null,
    lupaByYtunnus: ytunnus
      ? await getRaw(
          "lupaByYtunnus",
          `${
            backendRoutes.lupaByYtunnus.path
          }${ytunnus}?with=all&useKoodistoVersions=false${
            koulutustyyppi ? "&koulutustyyppi=" + koulutustyyppi : ""
          }`,
          keys,
          backendRoutes.lupaByUuid.minimumTimeBetweenFetchingInMinutes
        )
      : null,
    vstTyypit: await getRaw(
      "vstTyypit",
      `${backendRoutes.vsttyypit.path}`,
      keys
    ),
    // Koulutukset (muut)
    ammatilliseentehtavaanvalmistavakoulutus: await getRaw(
      "ammatilliseentehtavaanvalmistavakoulutus",
      `${backendRoutes.koulutuksetMuut.path}ammatilliseentehtavaanvalmistavakoulutus`,
      keys
    ),
    kuljettajakoulutus: await getRaw(
      "kuljettajakoulutus",
      `${backendRoutes.koulutuksetMuut.path}kuljettajakoulutus`,
      keys
    ),
    oivatyovoimakoulutus: await getRaw(
      "oivatyovoimakoulutus",
      `${backendRoutes.koulutuksetMuut.path}oivatyovoimakoulutus`,
      keys
    ),
    // Koulutukset (poikkeukset)
    poikkeus999901: await getRaw(
      "poikkeus999901",
      `${backendRoutes.koulutus.path}999901`,
      keys
    ),
    poikkeus999903: await getRaw(
      "poikkeus999903",
      `${backendRoutes.koulutus.path}999903`,
      keys
    ),
    kieletOPH: await getRaw("kieletOPH", backendRoutes.kieletOPH.path, keys),
    koulutusalat: await getRaw(
      "koulutusalat",
      backendRoutes.koulutusalat.path,
      keys
    ),
    koulutustyypit: await getRaw(
      "koulutustyypit",
      backendRoutes.koulutustyypit.path,
      keys
    ),
    kujalisamaareet: await getRaw(
      "kujalisamaareet",
      backendRoutes.kujalisamaareet.path,
      keys
    ),
    joistalisaksi: await getRaw(
      "joistalisaksi",
      backendRoutes.joistalisaksi.path,
      keys
    ),
    kunnat: await getRaw("kunnat", backendRoutes.kunnat.path, keys),
    maakunnat: await getRaw("maakunnat", backendRoutes.maakunnat.path, keys),
    maakuntakunnat: await getRaw(
      "maakuntakunnat",
      backendRoutes.maakuntakunnat.path,
      keys
    ),
    maaraystyypit: await getRaw(
      "maaraystyypit",
      backendRoutes.maaraystyypit.path,
      keys
    ),
    muut: await getRaw("muut", backendRoutes.muut.path, keys),
    oivaperustelut: await getRaw(
      "oivaperustelut",
      backendRoutes.oivaperustelut.path,
      keys
    ),
    opetuksenJarjestamismuodot: await getRaw(
      "opetuksenJarjestamismuodot",
      backendRoutes.opetuksenJarjestamismuodot.path,
      keys
    ),
    opetuskielet: await getRaw(
      "opetuskielet",
      backendRoutes.opetuskielet.path,
      keys
    ),
    opetustehtavakoodisto: await getRaw(
      "opetustehtavakoodisto",
      backendRoutes.opetustehtavakoodisto.path,
      keys
    ),
    opetustehtavat: await getRaw(
      "opetustehtavat",
      backendRoutes.opetustehtavat.path,
      keys
    ),
    organisaatio: await getRaw(
      "organisaatio",
      `${backendRoutes.organisaatio.path}${ytunnus}`,
      keys
    ),
    organisaatiot: await getRaw(
      "organisaatiot",
      koulutustyyppi
        ? `${backendRoutes.organisaatiot.path}?koulutustyyppi=${koulutustyyppi}`
        : backendRoutes.organisaatiot.path,
      keys
    ),
    poErityisetKoulutustehtavat: await getRaw(
      "poErityisetKoulutustehtavat",
      backendRoutes.poErityisetKoulutustehtavat.path,
      keys
    ),
    poMuutEhdot: await getRaw(
      "poMuutEhdot",
      backendRoutes.poMuutEhdot.path,
      keys
    ),
    tutkinnot: await getRaw("tutkinnot", backendRoutes.tutkinnot.path, keys),
    tulevatLuvat: await getRaw(
      "tulevatLuvat",
      `${backendRoutes.tulevatLuvat.path}${ytunnus}${
        backendRoutes.tulevatLuvat.postfix
      }?with=all&useKoodistoVersions=false${
        koulutustyyppi ? "&koulutustyyppi=" + koulutustyyppi : ""
      }${oppilaitostyyppi ? "&oppilaitostyyppi=" + oppilaitostyyppi : ""}`,
      keys,
      backendRoutes.tulevatLuvat.minimumTimeBetweenFetchingInMinutes
    ),
    vankilat: await getRaw("vankilat", backendRoutes.vankilat.path, keys),
    viimeisinLupa: await getRaw(
      "viimeisinLupa",
      `${backendRoutes.viimeisinLupa.path}${ytunnus}${
        backendRoutes.viimeisinLupa.postfix
      }?with=all&useKoodistoVersions=false${
        koulutustyyppi ? "&koulutustyyppi=" + koulutustyyppi : ""
      }`,
      keys,
      backendRoutes.viimeisinLupa.minimumTimeBetweenFetchingInMinutes
    )
  };
  const lupa = raw.viimeisinLupa ||
    (lupaUuid ? raw.lupaByUuid : ytunnus ? raw.lupaByYtunnus : null) || {
      maaraykset: []
    };

  /**
   * Varsinainen palautusarvo sisältää sekä muokkaamatonta että muokattua
   * dataa. Samalla noudettu data tallennetaan lokaaliin tietovarastoon
   * (indexedDB / WebSQL / localStorage) myöhempää käyttöä varten.
   */
  const maakuntakunnat = raw.maakuntakunnat
    ? await localforage.setItem(
        "maakuntakunnat",
        sortBy(
          path(["metadata", localeUpper, "nimi"]),
          map(maakunta => {
            return initializeMaakunta(maakunta, localeUpper);
          }, raw.maakuntakunnat).filter(Boolean)
        )
      )
    : undefined;

  const ahvenanmaanKunnat =
    (find(propEq("koodiarvo", "21"), maakuntakunnat || []) || {}).kunnat || [];

  const result = {
    elykeskukset: raw.elykeskukset
  };

  result.ajalla = raw.ajalla
    ? await localforage.setItem(
        "ajalla",
        sortBy(
          path(["metadata", localeUpper, "nimi"]),
          map(maare => {
            return omit(["koodiArvo"], {
              ...maare,
              koodiarvo: maare.koodiArvo,
              metadata: mapObjIndexed(
                head,
                groupBy(prop("kieli"), maare.metadata)
              )
            });
          }, raw.ajalla).filter(Boolean)
        )
      )
    : undefined;

  result.kielet = raw.kielet
    ? await localforage.setItem(
        "kielet",
        sortLanguages(
          map(kieli => {
            return initializeKieli(kieli);
          }, raw.kielet),
          localeUpper
        )
      )
    : undefined;

  result.kieletOPH = raw.kieletOPH
    ? await localforage.setItem(
        "kieletOPH",
        sortLanguages(
          map(kieli => {
            return initializeKieli(kieli);
          }, raw.kieletOPH),
          localeUpper
        )
      )
    : undefined;

  result.ensisijaisetOpetuskieletOPH = raw.kieletOPH
    ? await localforage.setItem(
        "ensisijaisetOpetuskieletOPH",
        filterEnsisijaisetOpetuskieletOPH(
          map(kieli => {
            return initializeKieli(kieli);
          }, raw.kieletOPH),
          localeUpper
        )
      )
    : undefined;

  result.kohteet = raw.kohteet
    ? await localforage.setItem("kohteet", raw.kohteet)
    : [];

  result.koulutukset =
    raw.ammatilliseentehtavaanvalmistavakoulutus ||
    raw.kuljettajakoulutus ||
    raw.oivatyovoimakoulutus ||
    raw.poikkeus999901 ||
    raw.poikkeus999903
      ? await localforage.setItem("koulutukset", {
          muut: {
            ammatilliseentehtavaanvalmistavakoulutus: raw.ammatilliseentehtavaanvalmistavakoulutus
              ? sortBy(
                  prop("koodiarvo"),
                  map(koulutus => {
                    return initializeKoulutus(koulutus);
                  }, raw.ammatilliseentehtavaanvalmistavakoulutus)
                )
              : undefined,
            kuljettajakoulutus: raw.kuljettajakoulutus
              ? sortBy(
                  prop("koodiarvo"),
                  map(koulutus => {
                    return initializeKoulutus(koulutus);
                  }, raw.kuljettajakoulutus)
                )
              : undefined,
            oivatyovoimakoulutus: raw.oivatyovoimakoulutus
              ? sortBy(
                  prop("koodiarvo"),
                  map(koulutus => {
                    return initializeKoulutus(koulutus);
                  }, raw.oivatyovoimakoulutus)
                )
              : undefined
          },
          poikkeukset: {
            999901: raw.poikkeus999901
              ? initializeKoulutus(raw.poikkeus999901)
              : undefined,
            999903: raw.poikkeus999903
              ? initializeKoulutus(raw.poikkeus999903)
              : undefined
          }
        })
      : undefined;

  result.koulutusalat = raw.koulutusalat
    ? await localforage.setItem(
        "koulutusalat",
        sortBy(
          prop("koodiarvo"),
          map(koulutusala => {
            return initializeKoulutusala(koulutusala);
          }, raw.koulutusalat)
        )
      )
    : undefined;

  result.koulutustyypit = raw.koulutustyypit
    ? await localforage.setItem(
        "koulutustyypit",
        sortBy(
          prop("koodiarvo"),
          map(koulutustyyppi => {
            return initializeKoulutustyyppi(koulutustyyppi);
          }, raw.koulutustyypit)
        )
      )
    : undefined;

  result.joistaLisaksi = raw.joistalisaksi
    ? await localforage.setItem(
        "joistaLisaksi",
        sortBy(
          path(["metadata", localeUpper, "nimi"]),
          map(maare => {
            return omit(["koodiArvo"], {
              ...maare,
              koodiarvo: maare.koodiArvo,
              metadata: mapObjIndexed(
                head,
                groupBy(prop("kieli"), maare.metadata)
              )
            });
          }, raw.joistalisaksi).filter(Boolean)
        )
      )
    : undefined;

  result.lisamaareet = raw.kujalisamaareet
    ? await localforage.setItem(
        "kujalisamaareet",
        sortBy(
          prop("koodiarvo"),
          map(lisamaare => {
            return initializeLisamaare(lisamaare);
          }, raw.kujalisamaareet).filter(Boolean)
        )
      )
    : undefined;

  result.kunnat = raw.kunnat
    ? await localforage.setItem(
        "kunnat",
        sortBy(
          path(["metadata", localeUpper, "nimi"]),
          map(kunta => {
            return initializeKunta(kunta, localeUpper, ahvenanmaanKunnat);
          }, raw.kunnat).filter(Boolean)
        )
      )
    : undefined;

  result.lisatiedot = raw.lisatiedot
    ? await localforage.setItem(
        "lisatiedot",
        initializeLisatiedot(raw.lisatiedot)
      )
    : undefined;

  result.lupa = lupa ? await localforage.setItem("lupa", lupa) : undefined;

  result.vstLuvat = raw.vstLuvat;

  result.vstTyypit = raw.vstTyypit
    ? await localforage.setItem(
        "vsttyypit",
        map(
          vstTyyppi =>
            omit(["koodiArvo"], {
              ...vstTyyppi,
              koodiarvo: vstTyyppi.koodiArvo,
              metadata: mapObjIndexed(
                head,
                groupBy(prop("kieli"), vstTyyppi.metadata)
              )
            }),
          raw.vstTyypit
        )
      )
    : undefined;

  result.maakunnat = raw.maakunnat
    ? await localforage.setItem(
        "maakunnat",
        sortBy(
          path(["metadata", localeUpper, "nimi"]),
          map(maakunta => {
            return omit(["koodiArvo"], {
              ...maakunta,
              koodiarvo: maakunta.koodiArvo,
              metadata: mapObjIndexed(
                head,
                groupBy(prop("kieli"), maakunta.metadata)
              )
            });
          }, raw.maakunnat).filter(Boolean)
        )
      )
    : undefined;

  result.maakuntakunnat = maakuntakunnat;

  result.maaraystyypit = raw.maaraystyypit
    ? await localforage.setItem("maaraystyypit", raw.maaraystyypit)
    : undefined;

  result.muut = raw.muut
    ? await localforage.setItem(
        "muut",
        sortArticlesByHuomioitavaKoodi(
          map(muudata => {
            return initializeMuu(muudata);
          }, raw.muut),
          localeUpper
        )
      )
    : undefined;

  result.oivaperustelut = raw.oivaperustelut
    ? await localforage.setItem(
        "oivaperustelut",
        sortBy(
          prop("koodiarvo"),
          map(perustelu => {
            return omit(["koodiArvo"], {
              ...perustelu,
              koodiarvo: perustelu.koodiArvo,
              metadata: mapObjIndexed(
                head,
                groupBy(prop("kieli"), perustelu.metadata)
              )
            });
          }, raw.oivaperustelut)
        )
      )
    : undefined;

  result.opetuksenJarjestamismuodot = raw.opetuksenJarjestamismuodot
    ? await localforage.setItem(
        "opetuksenJarjestamismuodot",
        sortBy(
          prop("koodiarvo"),
          initializeOpetuksenJarjestamismuodot(
            raw.opetuksenJarjestamismuodot,
            prop("maaraykset", raw.lupa) || []
          )
        )
      )
    : undefined;

  result.opetuskielet = raw.opetuskielet
    ? await localforage.setItem(
        "opetuskielet",
        sortBy(
          prop("koodiarvo"),
          initializeOpetuskielet(
            raw.opetuskielet,
            filter(
              maarays => maarays.koodisto === "oppilaitoksenopetuskieli",
              prop("maaraykset", lupa)
            ) || []
          )
        )
      )
    : undefined;

  result.opetustehtavakoodisto = raw.opetustehtavakoodisto
    ? await localforage.setItem("opetustehtavakoodisto", {
        ...raw.opetustehtavakoodisto,
        metadata: mapObjIndexed(
          head,
          groupBy(prop("kieli"), prop("metadata", raw.opetustehtavakoodisto))
        )
      })
    : undefined;

  result.opetustehtavat = raw.opetustehtavat
    ? await localforage.setItem(
        "opetustehtavat",
        initializeOpetustehtavat(raw.opetustehtavat)
      )
    : undefined;

  result.organisaatio = raw.organisaatio
    ? await localforage.setItem("organisaatio", raw.organisaatio)
    : undefined;

  result.organisaatiot = raw.organisaatiot
    ? await localforage.setItem("organisaatiot", raw.organisaatiot)
    : undefined;

  result.poErityisetKoulutustehtavat = raw.poErityisetKoulutustehtavat
    ? await localforage.setItem(
        "poErityisetKoulutustehtavat",
        initializePOErityisetKoulutustehtavat(
          raw.poErityisetKoulutustehtavat,
          prop("maaraykset", raw.lupa) || []
        )
      )
    : undefined;

  result.poMuutEhdot = raw.poMuutEhdot
    ? await localforage.setItem(
        "poMuutEhdot",
        initializePOMuutEhdot(
          raw.poMuutEhdot,
          prop("maaraykset", raw.lupa) || []
        )
      )
    : undefined;

  result.toissijaisetOpetuskieletOPH = raw.kieletOPH
    ? await localforage.setItem(
        "toissijaisetOpetuskieletOPH",
        filterToissijaisetOpetuskieletOPH(
          map(kieli => {
            return initializeKieli(kieli);
          }, raw.kieletOPH),
          localeUpper
        )
      )
    : undefined;

  result.tutkinnot = raw.tutkinnot
    ? await localforage.setItem(
        "tutkinnot",
        sortBy(
          prop("koodiarvo"),
          initializeTutkinnot(
            raw.tutkinnot,
            filter(
              maarays => maarays.koodisto === "koulutus",
              prop("maaraykset", lupa)
            ) || []
          )
        )
      )
    : undefined;

  result.tulevatLuvat = raw.tulevatLuvat || [];

  result.vankilat = raw.vankilat
    ? await localforage.setItem(
        "vankilat",
        sortBy(
          prop("koodiarvo"),
          map(perustelu => {
            return omit(["koodiArvo"], {
              ...perustelu,
              koodiarvo: perustelu.koodiArvo,
              metadata: mapObjIndexed(
                head,
                groupBy(prop("kieli"), perustelu.metadata)
              )
            });
          }, raw.vankilat)
        )
      )
    : undefined;

  result.viimeisinLupa = raw.viimeisinLupa || {};

  result.voimassaOlevaLupa = raw.lupaByUuid || raw.lupaByYtunnus;

  return result;
};

const defaultProps = {
  keys: []
};

const BaseData = ({
  keys = defaultProps.keys,
  locale,
  render,
  koulutustyyppi,
  oppilaitostyyppi,
  ytunnus
}) => {
  const { id } = useParams();
  const [baseData, setBaseData] = useState({});
  const location = useLocation();
  const _ytunnus = ytunnus || (id && test(/[0-9]{7}-[0-9]{1}/, id) ? id : null);
  const lupaUuid =
    id &&
    test(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/, id)
      ? id
      : null;
  /**
   * TO DO: Käytetään hauissa oid:tä, mikäli se on annettu y-tunnuksen sijaan.
   * Organisaation oid on aina muotoa 1.g2.246.562.10.XXXXXXXXXX.
   * const oid = !!_ytunnus ? id : null;
   **/

  /**
   * Lupa: datan noutaminen backendistä ja sen tallentaminen
   * paikalliseen tietovarastoon jäsenneltynä.
   */
  useEffect(() => {
    let isSubscribed = true;
    fetchBaseData(
      keys,
      locale,
      lupaUuid,
      _ytunnus,
      koulutustyyppi,
      oppilaitostyyppi
    ).then(result => {
      if (isSubscribed) {
        setBaseData(result);
      }
    });
    return () => (isSubscribed = false);
  }, [
    keys,
    locale,
    lupaUuid,
    _ytunnus,
    location.pathname,
    koulutustyyppi,
    oppilaitostyyppi
  ]);

  if (!isEmpty(baseData)) {
    return (
      <React.Fragment>
        {!!render ? render({ ...baseData, lupaUuid, ytunnus: _ytunnus }) : null}
      </React.Fragment>
    );
  }
  return <Loading></Loading>;
};

BaseData.propTypes = {
  keys: PropTypes.array,
  locale: PropTypes.string,
  render: PropTypes.func,
  koulutustyyppi: PropTypes.string,
  oppilaitostyyppi: PropTypes.string
};

export default BaseData;
