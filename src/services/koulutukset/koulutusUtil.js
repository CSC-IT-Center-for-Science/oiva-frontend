import _ from 'lodash'
import { parseLocalizedField } from "modules/helpers"
import { KOHTEET, KOODISTOT, MAARAYSTYYPIT } from "../../scenes/Jarjestajat/Jarjestaja/modules/constants"
import { getKohdeByTunniste, getMaaraystyyppiByTunniste } from "services/muutospyynnot/muutospyyntoUtil"
import { MUUTOS_TYPES } from "../../scenes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/uusiHakemusFormConstants"
import { meta_kuljettaja_jatko, meta_kuljettaja_perus, meta_oppisopimus, meta_tyovoima, meta_vaativa, meta_vankila } from "../../scenes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/lisaperusteluUtil"


export function getKieliByKoodi(koodi, kielet) {
  if (kielet && kielet.data) {
    return _.find(kielet.data, (kieli) => { return kieli.koodiArvo === koodi })
  } else {
    return undefined
  }
}

export function getKoulutusalaByKoodiarvo(koodi, koulutusalat) {
  if (koulutusalat && koulutusalat.data) {
    return _.find(koulutusalat.data, (a) => { return a.koodiArvo === koodi })
  } else {
    return undefined
  }
}

export function getKoulutustyyppiByKoodiarvo(koodi, koulutustyypit) {
  if (koulutustyypit && koulutustyypit.data) {
    return _.find(koulutustyypit.data, (t) => { return t.koodiArvo === koodi })
  } else {
    return undefined
  }
}

export function getTutkintoNimiByKoodiarvo(koodi, koulutukset) {
  if (koulutukset && koulutukset.koulutusdata) {
    let nimi = undefined
    _.forEach(koulutukset.koulutusdata, ala => {
      _.forEach(ala.koulutukset, tyyppi => {
        _.forEach(tyyppi.koulutukset, koulutus => {
          if (koulutus.koodiArvo === koodi) {
            nimi = parseLocalizedField(koulutus.metadata)
          }
        })
      })
    })

    return nimi
  }
}

export function getTutkintoByKoodiarvo(koodi, koulutukset) {
  if (koulutukset && koulutukset.koulutusdata) {
    let koulutus = undefined
    _.forEach(koulutukset.koulutusdata, ala => {
      _.forEach(ala.koulutukset, tyyppi => {
        _.forEach(tyyppi.koulutukset, k => {
          if (k.koodiArvo === koodi) {
            koulutus = k
          }
        })
      })
    })
    return koulutus
  }
}

export function getTutkintoKoodiByMaaraysId(maaraysId, lupa) {
  if (lupa && lupa.data && lupa.data.maaraykset) {
    const { maaraykset } = lupa.data
    const obj = _.find(maaraykset, {id: maaraysId})
    if (obj && obj.koodiarvo) {
      return obj.koodiarvo
    }
  }
}

export function getTutkintoNimiByMaaraysId(maaraysId, lupa) {
  if (lupa && lupa.data && lupa.data.maaraykset) {
    const { maaraykset } = lupa.data
    const obj = _.find(maaraykset, {id: maaraysId})
    if (obj && obj.koodi && obj.koodi.metadata) {
      return parseLocalizedField(obj.koodi.metadata)
    }
  }
}

export function getMuutosperusteluObjectById(muutosperustelukoodiarvo, muutosperustelut) {
  if (muutosperustelut && muutosperustelut.data) {
    return _.find(muutosperustelut.data, mperustelu => {
      return String(mperustelu.koodiArvo) === String(muutosperustelukoodiarvo)
    })
  }
}

export function getPaatoskierrosByUuid(paatoskierrosUuid, paatoskierrokset) {
  if (paatoskierrokset && paatoskierrokset.data) {
    return _.find(paatoskierrokset.data, paatoskierros => {
      return paatoskierros.uuid === paatoskierrosUuid
    })
  }
}

export function getEditIndex(values, koodiarvo, koodisto) {
  let i = undefined
  _.forEach(values, (value, idx) => {
    if (value.koodiarvo === koodiarvo && value.koodisto === koodisto) {
      i = idx
    }
  })
  return i
}

export function getChangeIndices(values, koodiarvo) {
  let indices = []
  _.forEach(values, (value, i) => {
    if (value.type === MUUTOS_TYPES.CHANGE && value.koodiarvo === koodiarvo) {
      indices.push(i)
    }
  })
  return indices
}

export function getOpiskelijavuosiIndex(values, koodiarvo) {
  let i = undefined
  _.forEach(values, (value, idx) => {
    if (value.koodiarvo === koodiarvo) {
      i = idx
    }
  })
  return i
}

export function handleSimpleCheckboxChange(event, editValues, fields, isInLupa, obj) {
  const { checked } = event.target
  const { koodiarvo, koodisto, kohde, maaraystyyppi } = obj
  if (checked) {
    if (isInLupa) {
      // Valtakunnallinen luvassa --> poistetaan se formista
      const i = getEditIndex(editValues, koodiarvo, koodisto)
      if (i !== undefined) {
        fields.remove(i)
      }
    } else {
      // Valtakunnallinen ei luvassa --> lisätään muutos formiin
      fields.push({
        type: 'addition',
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null,
        isValtakunnallinen: true,
        koodiarvo: 'FI1',
        koodisto: 'nuts1',
        kohde,
        maaraystyyppi,
        metadata: {
          kuvaus: {
            FI: 'Tutkintoja ja koulutusta saa lisäksi järjestää Ahvenanmaan maakuntaa lukuun ottamatta myös muualla Suomessa.',
            SV: 'Examina och utbildning får därtill ordnas även på annat håll i Finland, med undantag för landskapet Åland.'
          }
        }
      })
    }
  } else {
    if (isInLupa) {
      // Valtakunnallinen luvassa --> lisätään muutos formiin
      fields.push({
        type: 'addition',
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null,
        isValtakunnallinen: false,
        koodiarvo: 'FI1',
        koodisto: 'nuts1',
        kohde,
        maaraystyyppi,
        metadata: {
          kuvaus: {
            FI: 'Tutkintoja ja koulutusta saa lisäksi järjestää Ahvenanmaan maakuntaa lukuun ottamatta myös muualla Suomessa.',
            SV: 'Examina och utbildning får därtill ordnas även på annat håll i Finland, med undantag för landskapet Åland.'
          }
        }
      })
    } else {
      // Valtakunnallinen ei luvassa --> poistetaan se formista
      const i = getEditIndex(editValues, koodiarvo, koodisto)
      if (i !== undefined) {
        fields.remove(i)
      }
    }
  }
}

export function handleCheckboxChange(event, editValue, fields, isInLupa, currentObj) {
  const { koodiArvo, metadata, koodisto } = currentObj
  let { kohde, maaraystyyppi } = currentObj
  const { koodistoUri } = koodisto
  const nimi = parseLocalizedField(metadata, 'FI', 'nimi')
  const kuvaus = parseLocalizedField(metadata, 'FI', 'kuvaus')
  const kasite = parseLocalizedField(metadata, 'FI', 'kasite')
  const sisaltaa_merkityksen = parseLocalizedField(metadata, 'FI', 'sisaltaaMerkityksen')

  const { checked } = event.target

  if (!kohde) {
    if (koodistoUri === KOODISTOT.KOULUTUS || koodistoUri === KOODISTOT.KULJETTAJAKOULUTUS || koodistoUri === KOODISTOT.OIVA_TYOVOIMAKOULUTUS || koodistoUri === KOODISTOT.AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS) {
      kohde = getKohdeByTunniste(KOHTEET.TUTKINNOT)
    } else if (koodistoUri === KOODISTOT.OPPILAITOKSENOPETUSKIELI) {
      kohde = getKohdeByTunniste(KOHTEET.KIELI)
    } else if (koodistoUri === KOODISTOT.OIVA_MUUT) {
      kohde = getKohdeByTunniste(KOHTEET.MUUT)
    }
  }

  if (!maaraystyyppi) {
    if (koodistoUri === KOODISTOT.KOULUTUS || koodistoUri === KOODISTOT.KULJETTAJAKOULUTUS || koodistoUri === KOODISTOT.OIVA_TYOVOIMAKOULUTUS || koodistoUri === KOODISTOT.AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS) {
      maaraystyyppi = getMaaraystyyppiByTunniste(MAARAYSTYYPIT.OIKEUS)
    } else if (koodistoUri === KOODISTOT.OPPILAITOKSENOPETUSKIELI) {
      maaraystyyppi = getMaaraystyyppiByTunniste(MAARAYSTYYPIT.VELVOITE)
    } else if (koodistoUri === KOODISTOT.OIVA_MUUT) {
      if (koodiArvo === "3") {
        maaraystyyppi = getMaaraystyyppiByTunniste(MAARAYSTYYPIT.VELVOITE)
      } else {
        maaraystyyppi = getMaaraystyyppiByTunniste(MAARAYSTYYPIT.OIKEUS)
      }
    }
  }

  if (checked) {
    if (isInLupa) {
      // Tutkinto oli luvassa --> poistetaan se formista
      const i = getEditIndex(editValue, koodiArvo, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    } else {
      // Tutkinto ei ollut luvassa --> lisätään se formiin
      fields.push({
        koodiarvo: koodiArvo,
        koodisto: koodistoUri,
        nimi,
        kuvaus,
        isInLupa,
        kohde,
        maaraystyyppi,
        type: MUUTOS_TYPES.ADDITION,
        sisaltaa_merkityksen: sisaltaa_merkityksen,
        meta: {
          nimi,
          koulutusala: currentObj.koulutusalaKoodiArvo,
          koulutustyyppi: currentObj.koulutustyyppiKoodiArvo,
          perusteluteksti: null,
          ...(koodistoUri === KOODISTOT.KULJETTAJAKOULUTUS && sisaltaa_merkityksen === "jatko" &&  {perusteluteksti_kuljetus_jatko: meta_kuljettaja_jatko}),
          ...(koodistoUri === KOODISTOT.KULJETTAJAKOULUTUS && sisaltaa_merkityksen === "perus" && {perusteluteksti_kuljetus_perus: meta_kuljettaja_perus}),
          ...(koodistoUri === KOODISTOT.OIVA_MUUT && kasite === "laajennettu" && {perusteluteksti_oppisopimus: meta_oppisopimus}),
          ...(koodistoUri === KOODISTOT.OIVA_MUUT && kasite === "vankila"  && {perusteluteksti_vankila: meta_vankila}),
          ...(koodistoUri === KOODISTOT.OIVA_MUUT && (kasite === "vaativa_1" || kasite === "vaativa_2") && {perusteluteksti_vaativa: meta_vaativa}),
          ...(koodistoUri === KOODISTOT.OIVA_TYOVOIMAKOULUTUS  && (koodiArvo === "1" || koodiArvo === "3") && {perusteluteksti_tyovoima: meta_tyovoima})
        },
        muutosperustelukoodiarvo: null
      })
    }
  } else {
    if (isInLupa) {
      // Tutkinto oli luvassa --> lisätään muutos formiin
      fields.push({
        koodiarvo: koodiArvo,
        koodisto: koodistoUri,
        nimi,
        kuvaus,
        isInLupa,
        kohde,
        maaraystyyppi,
        type: MUUTOS_TYPES.REMOVAL,
        meta: {
          nimi,
          koulutusala: currentObj.koulutusalaKoodiArvo,
          koulutustyyppi: currentObj.koulutustyyppiKoodiArvo,
          perusteluteksti: null,
          ...(koodistoUri === KOODISTOT.KULJETTAJAKOULUTUS && (koodiArvo === "2" || koodiArvo === "3") &&  {perusteluteksti_kuljetus_jatko: meta_kuljettaja_jatko}),
          ...(koodistoUri === KOODISTOT.KULJETTAJAKOULUTUS && koodiArvo === "1" && {perusteluteksti_kuljetus_perus: meta_kuljettaja_perus}),
          ...(koodistoUri === KOODISTOT.OIVA_MUUT && kasite === "laajennettu" && {perusteluteksti_oppisopimus: meta_oppisopimus}),
          ...(koodistoUri === KOODISTOT.OIVA_MUUT && kasite === "vankila"  && {perusteluteksti_vankila: meta_vankila}),
          ...(koodistoUri === KOODISTOT.OIVA_MUUT && (kasite === "vaativa_1" || kasite === "vaativa_2") && {perusteluteksti_vaativa: meta_vaativa}),
          ...(koodistoUri === KOODISTOT.OIVA_TYOVOIMAKOULUTUS  && (koodiArvo === "1" || koodiArvo === "3") && {perusteluteksti_tyovoima: meta_tyovoima})
        },
        muutosperustelukoodiarvo: null
      })
    } else {
      // Tutkinto ei ollut luvassa --> poistetaan muutos formista
      const i = getEditIndex(editValue, koodiArvo, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    }
  }
}

export function handleOsaamislaCheckboxChange(event, editValue, fields, isInLupa, currentObj, parentId) {
  const { koodiArvo, metadata, koodisto } = currentObj
  const { koodistoUri } = koodisto
  const nimi = parseLocalizedField(metadata, 'FI', 'nimi')
  const kuvaus = parseLocalizedField(metadata, 'FI', 'kuvaus')

  const { checked } = event.target

  const parentObj = getTutkintoByKoodiarvo(parentId)

  // osaamisala spesific
  let kohde = getKohdeByTunniste(KOHTEET.TUTKINNOT)
  let maaraystyyppi = getMaaraystyyppiByTunniste(MAARAYSTYYPIT.RAJOITE)


  if (checked) {
    if (isInLupa) {
      // osaamisala oli luvassa --> poistetaan se formista
      const i = getEditIndex(editValue, koodiArvo, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    } else {
      // osaamisala ei ollut luvassa --> lisätään se formiin

      fields.push({
        koodiarvo: koodiArvo,
        koodisto: koodistoUri,
        parentId: parentId,  // tutkinnon koodiarvo
        nimi,
        kuvaus,
        isInLupa,
        kohde,
        maaraystyyppi,
        type: MUUTOS_TYPES.ADDITION,
        meta: { 
          perusteluteksti: null,
          koulutusala: parentObj.koulutusalaKoodiArvo,
          koulutustyyppi: parentObj.koulutustyyppiKoodiArvo
         },
        muutosperustelukoodiarvo: null
      })
    }
  } else {
    if (isInLupa) {
      // osaamisala oli luvassa --> lisätään muutos formiin
      fields.push({
        koodiarvo: koodiArvo,
        koodisto: koodistoUri,
        parentId: parentId,  // tutkinnon koodiarvo
        nimi,
        kuvaus,
        isInLupa,
        kohde,
        maaraystyyppi,
        type: MUUTOS_TYPES.REMOVAL,
        meta: { 
          perusteluteksti: null,
          koulutusala: parentObj.koulutusalaKoodiArvo,
          koulutustyyppi: parentObj.koulutustyyppiKoodiArvo
         },
        muutosperustelukoodiarvo: null
      })
    } else {
      // osaamisala ei ollut luvassa --> poistetaan muutos formista
      const i = getEditIndex(editValue, koodiArvo, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    }
  }
}

export function handleTutkintoKieliCheckboxChange(event, editValue, fields, isInLupa, value, currentObj) {
  const { nimi, kohde, maaraystyyppi } = currentObj
  let { koodi } = currentObj
  const koodistoUri = "kieli"

  if (!koodi && currentObj.koodiarvo) {
    koodi = currentObj.koodiarvo
  }

  const { checked } = event.target

  if (checked) {
    if (isInLupa) {
      // Tutkinto oli luvassa --> poistetaan se formista
      const i = getEditIndex(editValue, koodi, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    } else {
      // Tutkinto ei ollut luvassa --> lisätään se formiin
      fields.push({
        koodiarvo: koodi,
        koodisto: koodistoUri,
        nimi,
        kohde,
        maaraystyyppi,
        value,
        kuvaus: null,
        isInLupa,
        type: MUUTOS_TYPES.ADDITION,
        meta: {
          koulutusala: currentObj.koulutusalaKoodiArvo,
          koulutustyyppi: currentObj.koulutustyyppiKoodiArvo,
          perusteluteksti: null },
        muutosperustelukoodiarvo: null
      })
    }
  } else {
    if (isInLupa) {
      // Tutkinto oli luvassa --> lisätään muutos formiin
      fields.push({
        koodiarvo:
        koodi,
        koodisto: koodistoUri,
        nimi,
        value,
        kohde,
        maaraystyyppi,
        kuvaus: null,
        isInLupa,
        type: MUUTOS_TYPES.REMOVAL,
        meta: {
          koulutusala: currentObj.koulutusalaKoodiArvo,
          koulutustyyppi: currentObj.koulutustyyppiKoodiArvo,
          perusteluteksti: null },
        muutosperustelukoodiarvo: null
      })
    } else {
      // Tutkinto ei ollut luvassa --> poistetaan muutos formista
      const i = getEditIndex(editValue, koodi, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    }
    // Tarkastetaan, että editvaluesiin ei jää muutos-tyyppisiä arvoja
    if (editValue) {
      const indices = getChangeIndices(editValue, koodi)
      if (indices.length > 0) {
        indices.forEach(i => {
          fields.remove(i)
        })
      }
    }
  }
}

export function handleTutkintokieliSelectChange(editValues, fields, isInLupa, tutkinto, selectedValue) {
  if (selectedValue === null) {
    return
  }

  const { koodi, maaraysId, nimi, kohde, maaraystyyppi } = tutkinto
  const { value, koodisto, label } = selectedValue
  const { koodistoUri } = koodisto

  if (isInLupa) {
    // Tarkastetaan löytyykö muutosta editValuesista
    if (editValues) {
      const i = getEditIndex(editValues, koodi, koodistoUri)
      if (i !== undefined) {
        let obj = fields.get(i)
        fields.remove(i)
        obj.value = selectedValue.value
        fields.insert(i, obj)
      } else {
        fields.push({
          koodiarvo: koodi,
          koodisto: koodistoUri,
          nimi,
          maaraysId,
          value,
          label,
          kohde,
          maaraystyyppi,
          kuvaus: null,
          isInLupa,
          type: MUUTOS_TYPES.CHANGE,
          meta: { perusteluteksti: null },
          muutosperustelukoodiarvo: null
        })
      }
    } else {
      fields.push({
        koodiarvo: koodi,
        koodisto: koodistoUri,
        nimi,
        maaraysId,
        value,
        label,
        kohde,
        maaraystyyppi,
        kuvaus: null,
        isInLupa,
        type: MUUTOS_TYPES.CHANGE,
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null
      })
    }
  } else {
    if (editValues) {
      const i = getEditIndex(editValues, koodi, koodistoUri)
      if (i !== undefined) {
        let obj = fields.get(i)
        fields.remove(i)
        obj.value = value
        obj.label = label
        obj.isAdded = true
        fields.insert(i, obj)
      }
    }
  }
}

export function getKieliList(kielet, locale) {
  let kieletExtended = []

  kielet.forEach(kieli => {
    const { koodiArvo, koodisto, metadata, kohde, maaraystyyppi } = kieli
    kieletExtended.push({ koodiArvo, koodisto, metadata, kohde, maaraystyyppi, label: parseLocalizedField(metadata, locale), value: koodiArvo })
  })

  return kieletExtended
}
