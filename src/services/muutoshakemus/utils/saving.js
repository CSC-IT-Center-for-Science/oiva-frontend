import { getChangesToSave } from "./changes-to-save";
import { getChangesOfOpetuskielet } from "./opetuskieli-saving";
import { combineArrays } from "../../../utils/muutospyyntoUtil";
import moment from "moment";
import * as R from "ramda";

export function createObjectToSave(
  lupa,
  changeObjects,
  backendMuutokset = [],
  muutoshakemus,
  uuid
) {
  // Adds data that has attachements
  const yhteenvetoYleiset = R.path(
    ["yhteenveto", "yleisettiedot"],
    changeObjects
  );
  const yhteenvetoLiitteet = R.path(
    ["yhteenveto", "hakemuksenliitteet"],
    changeObjects
  );
  const taloudellisetLiitteet = R.path(
    ["taloudelliset", "liitteet"],
    changeObjects
  );
  const perustelutLiitteet = R.path(["perustelut", "liitteet"], changeObjects);

  //get actual attachment props

  const perustelutLiitteetList =
    perustelutLiitteet && perustelutLiitteet[0].properties
      ? perustelutLiitteet[0].properties.attachments
      : [];

  const taloudellisetLiitteetList =
    taloudellisetLiitteet && taloudellisetLiitteet[0].properties
      ? taloudellisetLiitteet[0].properties.attachments
      : [];

  const yhteenvetoYleisetLiitteetList =
    yhteenvetoYleiset && yhteenvetoYleiset[0].properties
      ? yhteenvetoYleiset[0].properties.attachments
      : [];

  const yhteenvetoLiitteetList =
    yhteenvetoLiitteet && yhteenvetoLiitteet[0].properties
      ? yhteenvetoLiitteet[0].properties.attachments
      : [];

  // Concats all attachements...

  const allAttachmentsRaw = combineArrays([
    perustelutLiitteetList,
    taloudellisetLiitteetList,
    yhteenvetoYleisetLiitteetList,
    yhteenvetoLiitteetList
  ]).filter(Boolean);

  // ... without tiedosto-property
  const allAttachments = R.map(attachment => {
    return R.dissoc("tiedosto", attachment);
  }, allAttachmentsRaw);

  const getValueByPathAndAnchor = (anchor, path, changeObjects) => {
    return R.path(
      ["properties", "value"],
      R.find(R.propEq("anchor", anchor), R.path(path, changeObjects) || []) ||
        {}
    );
  };

  return {
    diaarinumero: lupa.diaarinumero,
    jarjestajaOid: lupa.jarjestajaOid,
    jarjestajaYtunnus: lupa.jarjestajaYtunnus,
    luoja: sessionStorage.getItem("username"),
    // luontipvm: moment().valueOf(),
    luontipvm: moment().format("YYYY-MM-DD"),
    lupaUuid: lupa.uuid,
    // uuid: lupa.asiatyyppi.uuid,
    tila: "LUONNOS",
    paivittaja: "string",
    paivityspvm: null,
    voimassaalkupvm: getValueByPathAndAnchor(
      "yhteenveto_yleisettiedot.muutoksien-voimaantulo.ajankohta",
      ["yhteenveto", "yleisettiedot"],
      changeObjects
    ),
    voimassaloppupvm: null, // TODO: find the correct value somehow,
    liitteet: allAttachments,
    meta: {
      tutkinnotjakoulutuksetLiitteet: {
        changeObjects: R.flatten([
          R.path(["perustelut", "liitteet"], changeObjects)
        ]).filter(Boolean)
      },
      taloudelliset: {
        edellytykset: getValueByPathAndAnchor(
          "taloudelliset_yleisettiedot.edellytykset-tekstikentta.A",
          ["taloudelliset", "yleisettiedot"],
          changeObjects
        ),
        vaikutukset: getValueByPathAndAnchor(
          "taloudelliset_yleisettiedot.Vaikutukset-tekstikentta.A",
          ["taloudelliset", "yleisettiedot"],
          changeObjects
        ),
        sopeuttaminen: getValueByPathAndAnchor(
          "taloudelliset_yleisettiedot.sopeuttaminen-tekstikentta.A",
          ["taloudelliset", "yleisettiedot"],
          changeObjects
        ),
        investoinnit: getValueByPathAndAnchor(
          "taloudelliset_investoinnit.investoinnit-tekstikentta.A",
          ["taloudelliset", "investoinnit"],
          changeObjects
        ),
        kustannukset: getValueByPathAndAnchor(
          "taloudelliset_investoinnit.kustannukset-Input.A",
          ["taloudelliset", "investoinnit"],
          changeObjects
        ),
        rahoitus: getValueByPathAndAnchor(
          "taloudelliset_investoinnit.rahoitus-tekstikentta.A",
          ["taloudelliset", "investoinnit"],
          changeObjects
        ),
        omavaraisuusaste: getValueByPathAndAnchor(
          "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.omavaraisuusaste",
          ["taloudelliset", "tilinpaatostiedot"],
          changeObjects
        ),
        maksuvalmius: getValueByPathAndAnchor(
          "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.maksuvalmius",
          ["taloudelliset", "tilinpaatostiedot"],
          changeObjects
        ),
        velkaantuneisuus: getValueByPathAndAnchor(
          "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.velkaantuneisuus",
          ["taloudelliset", "tilinpaatostiedot"],
          changeObjects
        ),
        kannattavuus: getValueByPathAndAnchor(
          "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.kannattavuus",
          ["taloudelliset", "tilinpaatostiedot"],
          changeObjects
        ),
        jaama: getValueByPathAndAnchor(
          "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.jaama",
          ["taloudelliset", "tilinpaatostiedot"],
          changeObjects
        ),
        changeObjects: R.flatten([
          R.path(["taloudelliset", "yleisettiedot"], changeObjects),
          R.path(["taloudelliset", "investoinnit"], changeObjects),
          R.path(["taloudelliset", "tilinpaatostiedot"], changeObjects),
          R.path(["taloudelliset", "liitteet"], changeObjects)
        ]).filter(Boolean)
      },
      yhteenveto: {
        yhteyshenkilo: {
          nimi: getValueByPathAndAnchor(
            "yhteenveto_yleisettiedot.yhteyshenkilo.nimi",
            ["yhteenveto", "yleisettiedot"],
            changeObjects
          ),
          nimike: getValueByPathAndAnchor(
            "yhteenveto_yleisettiedot.yhteyshenkilo.nimike",
            ["yhteenveto", "yleisettiedot"],
            changeObjects
          ),
          puhelin: getValueByPathAndAnchor(
            "yhteenveto_yleisettiedot.yhteyshenkilo.puhelinnumero",
            ["yhteenveto", "yleisettiedot"],
            changeObjects
          ),
          email: getValueByPathAndAnchor(
            "yhteenveto_yleisettiedot.yhteyshenkilo.sahkoposti",
            ["yhteenveto", "yleisettiedot"],
            changeObjects
          )
        },
        saate: getValueByPathAndAnchor(
          "yhteenveto_yleisettiedot.saate.tekstikentta",
          ["yhteenveto", "yleisettiedot"],
          changeObjects
        ),
        allekirjoittaja: {
          nimi: getValueByPathAndAnchor(
            "yhteenveto_yleisettiedot.hyvaksyja.nimi",
            ["yhteenveto", "yleisettiedot"],
            changeObjects
          ),
          nimike: getValueByPathAndAnchor(
            "yhteenveto_yleisettiedot.hyvaksyja.nimike",
            ["yhteenveto", "yleisettiedot"],
            changeObjects
          )
        },
        changeObjects: R.flatten([
          R.path(["yhteenveto", "yleisettiedot"], changeObjects),
          R.path(["yhteenveto", "hakemuksenliitteet"], changeObjects)
        ]).filter(Boolean)
      }
    },
    muutokset: R.flatten([
      // TUTKINNOT
      getChangesToSave(
        "tutkinnot",
        R.path(["tutkinnot"], muutoshakemus), // stateObject
        {
          // Page 1 changes
          muutokset: R.compose(
            R.flatten,
            R.values
          )(R.values(R.path(["tutkinnot"], changeObjects))),
          // Page 2 changes
          perustelut: R.compose(
            R.flatten,
            R.values
          )(R.values(R.path(["perustelut", "tutkinnot"], changeObjects)))
        },
        R.filter(R.pathEq(["kohde", "tunniste"], "tutkinnotjakoulutukset"))(
          backendMuutokset
        )
      ),
      // KOULUTUKSET
      getChangesToSave(
        "koulutukset",
        R.path(["koulutukset"], muutoshakemus),
        {
          muutokset: R.compose(
            R.flatten,
            R.values
          )(R.values(R.path(["koulutukset"], changeObjects))),
          perustelut: R.compose(
            R.flatten,
            R.values
          )(R.values(R.path(["perustelut", "koulutukset"], changeObjects)))
        },
        R.filter(R.pathEq(["kohde", "tunniste"], "tutkinnotjakoulutukset"))(
          backendMuutokset
        )
      ),
      // OPETUSKIELET
      getChangesOfOpetuskielet(
        R.path(["kielet", "opetuskielet"], muutoshakemus),
        R.flatten([
          R.path(["kielet", "opetuskielet"], changeObjects) || [],
          R.path(["perustelut", "kielet", "opetuskielet"], changeObjects) || []
        ]),
        R.filter(R.propEq("koodisto", "oppilaitoksenopetuskieli"))(
          backendMuutokset
        )
      ),
      // TUTKINTOKIELET
      getChangesToSave(
        "tutkintokielet",
        R.path(["kielet", "tutkintokielet"], muutoshakemus),
        {
          muutokset: R.compose(
            R.flatten,
            R.values
          )(R.values(R.path(["kielet", "tutkintokielet"], changeObjects))),
          perustelut: R.compose(
            R.flatten,
            R.values
          )(
            R.values(
              R.path(["perustelut", "kielet", "tutkintokielet"], changeObjects)
            )
          )
        },
        R.filter(R.pathEq(["koodisto"], "kieli"))(backendMuutokset)
      ),
      // TOIMINTA-ALUE
      getChangesToSave(
        "toimintaalue",
        R.path(["toimintaalue"], muutoshakemus),
        {
          muutokset: R.path(["toimintaalue"], changeObjects) || [],
          perustelut: (() => {
            // There is only one field for reasoning and it must be used as a source
            // for the actual change objects.
            const sourceObject = (R.path(
              ["perustelut", "toimintaalue"],
              changeObjects
            ) || [])[0];
            /**
             * Next step is to go through all the Toiminta-alue related "change objects" of the first
             * page of the wizard and generate change objects based on them.
             */
            return !!sourceObject
              ? R.map(changeObject => {
                  return {
                    anchor: `perustelut_${changeObject.anchor}`,
                    properties: sourceObject.properties
                  };
                }, R.path(["toimintaalue"], changeObjects) || [])
              : [];
          })()
        },
        R.filter(R.pathEq(["kohde", "tunniste"], "toimintaalue"))(
          backendMuutokset
        )
      ),
      // OPISKELIJAVUODET
      getChangesToSave(
        "opiskelijavuodet",
        {
          opiskelijavuodet: R.path(["opiskelijavuodet"], muutoshakemus),
          muut: R.path(["muut"], muutoshakemus)
        },
        {
          muutokset: R.compose(
            R.flatten,
            R.values
          )(R.values(R.path(["opiskelijavuodet"], changeObjects))),
          perustelut: R.compose(
            R.flatten,
            R.values
          )(R.values(R.path(["perustelut", "opiskelijavuodet"], changeObjects)))
        },
        R.filter(R.pathEq(["kohde", "tunniste"], "opiskelijavuodet"))(
          backendMuutokset
        )
      ),
      // MUUT
      getChangesToSave(
        "muut",
        R.path(["muut"], muutoshakemus),
        {
          muutokset: R.compose(
            R.flatten,
            R.values
          )(R.values(R.path(["muut"], changeObjects))),
          perustelut: R.compose(
            R.flatten,
            R.values
          )(R.values(R.path(["perustelut", "muut"], changeObjects)))
        },
        R.filter(R.pathEq(["kohde", "tunniste"], "muut"))(backendMuutokset)
      )
    ]),
    uuid
  };
}
