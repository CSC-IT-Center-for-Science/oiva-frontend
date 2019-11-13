import _ from "lodash";
import dateformat from "dateformat";
import {
  MUUTOS_TILAT,
  MUUTOS_TYPES
} from "../scenes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/uusiHakemusFormConstants";
import { KOHTEET } from "../scenes/Jarjestajat/Jarjestaja/modules/constants";
import * as R from "ramda";

export function formatMuutospyynto(muutospyynto) {
  const {
    diaarinumero,
    jarjestajaOid,
    jarjestajaYtunnus,
    luoja,
    luontipvm,
    lupaUuid,
    tila,
    uuid,
    tutkinnotjakoulutukset = [],
    opetusjatutkintokielet = [],
    toimintaalueet = [],
    opiskelijavuodet = [],
    muutmuutokset = [],
    hakija = [],
    taloudelliset = [],
    liitteet = [],
    meta = []
  } = muutospyynto;

  let muutokset = [
    ...formatMuutosArray(tutkinnotjakoulutukset),
    ...formatMuutosArray(opetusjatutkintokielet),
    ...formatMuutosArray(toimintaalueet),
    ...formatMuutosArray(opiskelijavuodet),
    ...formatMuutosArray(muutmuutokset)
  ];

  // Itse liitteitä ei tarvita tallennuksen json:nissa
  muutokset.map(item => {
    if (item.liitteet && item.liitteet.length > 0) {
      item.liitteet.map(liite => delete liite.tiedosto);
    }
    return true;
  });

  let metadata = { meta, ...hakija };
  if (taloudelliset) metadata.taloudelliset = taloudelliset;

  return {
    diaarinumero,
    jarjestajaOid,
    jarjestajaYtunnus,
    luoja,
    luontipvm,
    lupaUuid,
    uuid,
    paatoskierros: getDefaultPaatoskierros(),
    tila,
    paivittaja: "string",
    paivityspvm: null,
    voimassaalkupvm: "2018-01-01",
    voimassaloppupvm: "2018-12-31",
    meta: metadata,
    muutokset: muutokset,
    liitteet
  };
}

export function createAttachmentArray(muutokset) {
  const liitteet = [];
  muutokset.map(item => {
    if (item && item.liitteet && item.liitteet.length > 0) {
      item.liitteet.map(liite => {
        let tulosliite = {};
        tulosliite.tiedostoId = liite.tiedostoId;
        tulosliite.uuid = liite.uuid;
        tulosliite.tyyppi = liite.tyyppi;
        tulosliite.nimi = liite.nimi;
        tulosliite.salainen = liite.salainen;
        tulosliite.removed = liite.removed;
        tulosliite.paikka = liite.paikka;
        tulosliite.filename = liite.filename;
        if (liite.tiedosto && !liite.removed) {
          tulosliite.tiedosto = new Blob([liite.tiedosto]);
          liite.tiedosto = null;
        }
        liitteet.push(tulosliite);
        return true;
      });
    }
    return true;
  });
  return liitteet;
}

export function getAttachments(muutospyynto) {
  const {
    tutkinnotjakoulutukset = [],
    opetusjatutkintokielet = [],
    toimintaalueet = [],
    opiskelijavuodet = [],
    muutmuutokset = [],
    taloudelliset = [],
    liitteet = []
  } = muutospyynto;
  const commonAttachments = {};
  commonAttachments.liitteet = liitteet;

  let muutokset = [
    ...formatMuutosArray(tutkinnotjakoulutukset),
    ...formatMuutosArray(opetusjatutkintokielet),
    ...formatMuutosArray(toimintaalueet),
    ...formatMuutosArray(opiskelijavuodet),
    ...formatMuutosArray(muutmuutokset),
    taloudelliset[0],
    commonAttachments
  ];

  let kaikkiliitteet = createAttachmentArray(muutokset);

  return kaikkiliitteet;
}

function formatMuutosArray(muutokset) {
  if (!muutokset) {
    return [];
  }

  return _.map(muutokset, muutos =>
    _.assignIn({}, muutos, {
      tila:
        muutos.type === MUUTOS_TYPES.ADDITION
          ? MUUTOS_TILAT.LISAYS
          : muutos.type === MUUTOS_TYPES.REMOVAL
          ? MUUTOS_TILAT.POISTO
          : muutos.type === MUUTOS_TYPES.CHANGE
          ? MUUTOS_TILAT.MUUTOS
          : null
    })
  );
}

function getDefaultPaatoskierros(paatoskierrokset) {
  if (paatoskierrokset && paatoskierrokset.data) {
    const pkierrosObj = _.find(paatoskierrokset.data, pkierros => {
      if (pkierros.meta && pkierros.meta.nimi && pkierros.meta.nimi.fi) {
        if (pkierros.id === 19) {
          return pkierros;
        }
      }
    });

    if (pkierrosObj) {
      return { uuid: pkierrosObj.uuid };
    }
  }

  return undefined;
}

export function getJarjestajaData(state) {
  let username = "oiva-default";
  if (state.user && state.user.fetched) {
    username = state.user.user.username;
  } else {
    username = sessionStorage.getItem("username");
  }

  if (
    state.lupa &&
    state.lupa.fetched &&
    state.paatoskierrokset &&
    state.paatoskierrokset.fetched
  ) {
    const { data } = state.lupa;
    const { uuid, diaarinumero, jarjestajaYtunnus, jarjestajaOid } = data;

    const now = dateformat(new Date(), "yyyy-mm-dd");

    return {
      diaarinumero,
      // hakupvm: now, // kun siirretään käsittelyyn
      jarjestajaOid,
      jarjestajaYtunnus,
      luoja: username,
      luontipvm: now,
      lupaUuid: uuid,
      paatoskierrosId: null,
      paivityspvm: now,
      tila: "LUONNOS",
      voimassaalkupvm: null,
      voimassaloppupvm: null,
      muutokset: [],
      meta: {}
    };
  }
}

export function getBaseJarjestajaData(state) {
  if (
    state.lupa &&
    state.lupa.fetched &&
    state.paatoskierrokset &&
    state.paatoskierrokset.fetched
  ) {
    const { data } = state.lupa;
    const { diaarinumero, jarjestajaYtunnus, jarjestajaOid } = data;

    return {
      diaarinumero,
      jarjestajaOid,
      jarjestajaYtunnus,
      paatoskierrosId: null,
      meta: {}
    };
  }
}

function getHakija(meta) {
  if (!meta) {
    return;
  }

  const { nimi, puhelin, email, hyvaksyjat, haettupvm } = meta;
  return {
    nimi,
    puhelin,
    email,
    hyvaksyjat,
    haettupvm
  };
}

function getTaloudelliset(meta) {
  if (!meta) {
    return;
  }

  const { taloudelliset } = meta;
  return {
    taloudelliset
  };
}

export function loadFormData(state, muutosdata, formValues) {
  const {
    voimassaalkupvm,
    voimassaloppupvm,
    tila,
    luoja,
    luontipvm,
    meta,
    lupaUuid,
    uuid,
    paatoskierros,
    muutokset,
    liitteet
  } = muutosdata;

  const taloudelliset = getTaloudelliset(meta);
  let hakija = getHakija(meta);
  if (formValues) {
    if (formValues.hakija) {
      hakija = formValues.hakija;
    }
  }

  let initialData = getBaseJarjestajaData(state);

  initialData = {
    ...initialData,
    voimassaalkupvm,
    voimassaloppupvm,
    tila,
    luoja,
    luontipvm,
    hakija,
    lupaUuid,
    uuid,
    paatoskierros,
    taloudelliset,
    liitteet
  };

  // formatoi muutokset

  if (state.kohteet && state.kohteet.fetched) {
    const kohteet = state.kohteet.data;

    // 1. Tutkinnot ja koulutukset
    const tutkinnotKohde = _.find(kohteet, kohde => {
      return kohde.tunniste === KOHTEET.TUTKINNOT;
    });

    if (tutkinnotKohde) {
      initialData[KOHTEET.TUTKINNOT] = getMuutosArray(
        muutokset,
        tutkinnotKohde.uuid
      );
    }
  }

  return initialData;
}

function getMuutosArray(muutokset, kohdeUuid) {
  if (!muutokset || !kohdeUuid) {
    return;
  }

  let results = _.filter(muutokset, muutos => {
    if (muutos.kohde) {
      return muutos.kohde.uuid === kohdeUuid;
    }
  });

  _.forEach(results, muutos => {
    const tyyppi =
      muutos.tila === MUUTOS_TILAT.LISAYS
        ? MUUTOS_TYPES.ADDITION
        : muutos.tila === MUUTOS_TILAT.POISTO
        ? MUUTOS_TYPES.REMOVAL
        : muutos.tila === MUUTOS_TILAT.MUUTOS
        ? MUUTOS_TYPES.CHANGE
        : null;
    _.extend(muutos, { type: tyyppi });
  });

  return results;
}

export function hasFormChanges(formValues) {
  if (formValues) {
    const {
      tutkinnotjakoulutukset,
      opetusjatutkintokielet,
      toimintaalueet,
      opiskelijavuodet,
      muutmuutokset,
      taloudelliset
    } = formValues;

    if (tutkinnotjakoulutukset && tutkinnotjakoulutukset.length > 0) {
      return true;
    } else if (opetusjatutkintokielet && opetusjatutkintokielet.length > 0) {
      return true;
    } else if (toimintaalueet && toimintaalueet.length > 0) {
      return true;
    } else if (opiskelijavuodet && opiskelijavuodet.length > 0) {
      return true;
    } else if (taloudelliset && taloudelliset.length > 0) {
      return true;
    } else if (muutmuutokset && muutmuutokset.length > 0) {
      return true;
    }
  }

  return false;
}

export function getMaaraystyyppiByTunniste(tunniste, _maaraystyypit) {
  if (_maaraystyypit && _maaraystyypit.fetched) {
    const maaraystyypit = _maaraystyypit.data;
    return _.find(maaraystyypit, maaraystyyppi => {
      return maaraystyyppi.tunniste.toLowerCase() === tunniste.toLowerCase();
    });
  }
}

export function getKohdeByTunniste(tunniste, kohteet) {
  if (kohteet && kohteet.fetched) {
    return _.find(kohteet.data, kohde => {
      return kohde.tunniste.toLowerCase() === tunniste.toLowerCase();
    });
  }
}

/**
 * Finds tiedostoId properties from changeObj structure and sets uuids based on attachment list.
 * @param attachments List of objects from which uuid is copied to destination object based on matching tiedostoId
 * @param changeObj Object structure to set uuids to
 */
export function setAttachmentUuids(
  attachments,
  changeObj
) {
  const setUuids = (obj) => {
    if (obj instanceof Array) {
      obj = R.map(setUuids, obj);
    }
    else if (obj instanceof Object) {
      const tiedostoId = R.prop("tiedostoId", obj);
      if (tiedostoId && !R.prop("uuid", obj)) {
        const uuid = R.prop("uuid", R.find(R.propEq("tiedostoId", tiedostoId), attachments));
        obj = Object.assign({}, obj, {"uuid": uuid, "new": false});
      }

      obj = R.compose(
        R.fromPairs,
        R.map(([k, v]) => [k, setUuids(v)]),
        R.toPairs
      )(obj);
    }

    return obj;
  };

  return setUuids(changeObj);
}

// Combine arrays recursively
export function combineArrays(arrays) {
  if (arrays && arrays.length > 0) {
    const currentArray = arrays.pop();
    if (!currentArray) return combineArrays(arrays);
    else if (arrays) {
      return currentArray.concat(combineArrays(arrays));
    } else return currentArray;
  } else return [];
}
