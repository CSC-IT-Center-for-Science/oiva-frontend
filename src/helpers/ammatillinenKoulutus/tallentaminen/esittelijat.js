import moment from "moment";
import * as tutkinnotHelper from "../../../helpers/tutkinnot/";
import * as toimintaalueHelper from "../../../helpers/toiminta-alue/";
import * as opiskelijavuodetHelper from "../../../helpers/opiskelijavuodet";
import * as muutHelper from "../../../helpers/muut";
import * as kieletHelper from "../../../helpers/kielet";
import * as koulutuksetHelper from "../../../helpers/koulutukset";
import * as R from "ramda";

/**
 * Muodostaa ja palauttaa objektin, joka sisältää tallennettavat tiedot.
 * Koska funktiota kutsutaan esittelijöiden toimesta, ei perusteluita
 * muutoksille tarvita.
 *
 * @param {*} locale
 * @param {*} organisation
 * @param {*} lupa
 * @param {*} changeObjects
 * @param {*} uuid
 * @param {*} kohteet
 * @param {*} maaraystyypit
 * @param {*} muut
 * @param {*} lupaKohteet
 */
export async function createObjectToSave(
  locale,
  organisation,
  lupa,
  changeObjects,
  uuid,
  kohteet,
  maaraystyypit,
  muut,
  lupaKohteet,
  lomakedata
) {
  // TUTKINNOT, OSAAMISALAT JA TUKINTOKIELET
  const tutkinnot = await tutkinnotHelper.defineBackendChangeObjects(
    {
      tutkinnotJaOsaamisalat: {
        muutokset: changeObjects.tutkinnot,
        perustelut: []
      },
      tutkintokielet: {
        muutokset: changeObjects.tutkintokielet,
        perustelut: []
      }
    },
    R.find(R.propEq("tunniste", "tutkinnotjakoulutukset"), kohteet),
    R.find(R.propEq("tunniste", "opetusjatutkintokieli"), kohteet),
    maaraystyypit,
    locale
  );

  // KOULUTUKSET
  const koulutukset = koulutuksetHelper.getChangesToSave(
    {
      muutokset: changeObjects.koulutukset,
      perustelut: []
    },
    R.find(R.propEq("tunniste", "tutkinnotjakoulutukset"), kohteet),
    maaraystyypit,
    locale
  );

  // OPETUSKIELET
  const opetuskielet = kieletHelper.getChangesToSave(
    {
      muutokset: changeObjects.opetuskielet,
      perustelut: []
    },
    R.find(R.propEq("tunniste", "opetusjatutkintokieli"), kohteet),
    maaraystyypit
  );

  // TOIMINTA-ALUE
  const categoryFilterChangeObj = R.find(
    R.propEq("anchor", "categoryFilter"),
    changeObjects.toimintaalue
  );

  const toimintaalue = categoryFilterChangeObj
    ? await toimintaalueHelper.defineBackendChangeObjects(
        {
          quickFilterChanges: R.path(
            ["properties", "quickFilterChanges"],
            categoryFilterChangeObj
          ),
          changesByProvince: R.path(
            ["properties", "changesByProvince"],
            categoryFilterChangeObj
          ),
          perustelut: []
        },
        R.find(R.propEq("tunniste", "toimintaalue"), kohteet),
        maaraystyypit,
        lupa.maaraykset
      )
    : [];

  // OPISKELIJAVUODET
  const opiskelijavuodet = opiskelijavuodetHelper.createBackendChangeObjects(
    {
      muutokset: changeObjects.opiskelijavuodet,
      perustelut: []
    },
    R.find(R.propEq("tunniste", "opiskelijavuodet"), kohteet),
    maaraystyypit,
    muut,
    lupaKohteet,
    changeObjects.muut,
    lomakedata.muut
  );

  // MUUT
  const muutMuutokset = muutHelper.getChangesToSave(
    {
      muutokset: changeObjects.muut,
      perustelut: []
    },
    R.find(R.propEq("tunniste", "muut"), kohteet),
    maaraystyypit,
    R.filter(
      maarays =>
        maarays.koodisto === "oivamuutoikeudetvelvollisuudetehdotjatehtavat",
      lupa.maaraykset
    )
  );

  let objectToSave = {
    alkupera: "ESITTELIJA",
    diaarinumero: lupa.diaarinumero,
    jarjestajaOid: organisation.oid,
    jarjestajaYtunnus: organisation.ytunnus,
    luoja: sessionStorage.getItem("username"),
    luontipvm: moment().format("YYYY-MM-DD"),
    lupaUuid: lupa.uuid,
    tila: uuid ? "VALMISTELUSSA" : "LUONNOS",
    paivittaja: "string",
    paivityspvm: null,
    voimassaalkupvm: null,
    voimassaloppupvm: null, // TODO: find the correct value somehow,
    liitteet: [], // allAttachments,
    meta: {},
    muutokset: R.flatten([
      tutkinnot,
      koulutukset,
      opetuskielet,
      toimintaalue,
      opiskelijavuodet,
      muutMuutokset
    ]),
    uuid
  };

  const asianumeroObj = R.find(
    R.propEq("anchor", "topthree.asianumero.A"),
    changeObjects.topthree || []
  );
  objectToSave.asianumero = asianumeroObj ? asianumeroObj.properties.value : "";
  const paatospaivaObj = R.find(
    R.propEq("anchor", "topthree.paatospaiva.A"),
    changeObjects.topthree || []
  );
  objectToSave.paatospvm =
    paatospaivaObj && paatospaivaObj.properties.value
      ? moment(paatospaivaObj.properties.value).format("YYYY-MM-DD")
      : "";
  const voimaantulopaivaObj = R.find(
    R.propEq("anchor", "topthree.voimaantulopaiva.A"),
    changeObjects.topthree || []
  );
  objectToSave.voimassaalkupvm =
    voimaantulopaivaObj && voimaantulopaivaObj.properties.value
      ? moment(voimaantulopaivaObj.properties.value).format("YYYY-MM-DD")
      : "";
  // This helps the frontend to initialize the first three fields on form load.
  objectToSave.meta.topthree = changeObjects.topthree;

  return objectToSave;
}
