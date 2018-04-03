import _ from 'lodash'
import { KOHTEET, KOODISTOT, TUTKINTO_TEKSTIT, LUPA_SECTIONS, LUPA_TEKSTIT } from "./constants"
import { parseLocalizedField } from "../../../../modules/helpers"

export const parseLupa = (lupa) => {
  if (lupa) {
    let lupaObj = {}

    for (const key in LUPA_SECTIONS) {
      if (LUPA_SECTIONS.hasOwnProperty(key)) {
        const { heading, tunniste, headingNumber } = LUPA_SECTIONS[key]
        const currentMaaraykset = parseMaaraykset(lupa.maaraykset, tunniste)

        lupaObj[key] = parseSectionData(heading, tunniste, currentMaaraykset, headingNumber)

      }
    }

    return lupaObj
  }
}

const parseSectionData = (heading, target, maaraykset, headingNumber) => {
  let returnobj = {}
  let tutkinnot = []
  let muutMaaraykset = []


  // kohde 1: Erikoiskäsittely tutkinnoille ja koulutuksille
  if (target === KOHTEET.TUTKINNOT) {

    _.forEach(maaraykset, (maarays) => {
      const { koodisto, uuid } = maarays

      switch (koodisto) {
        case KOODISTOT.KOULUTUS: {
          const { koodi, ylaKoodit, aliMaaraykset } = maarays
          const { koodiArvo, metadata } = koodi
          const tutkintoNimi = parseLocalizedField(metadata)
          let tutkinto = {}

          // Käsitellään poikkeukset: valma (999901) ja telma (999903)
          if (koodiArvo === "999901") {
            muutMaaraykset.push({
              koodi: koodiArvo,
              nimi: tutkintoNimi,
              selite: TUTKINTO_TEKSTIT.valma.selite,
              indeksi: muutMaaraykset.length + 1,
              maaraysId: uuid
            })
            return
          }

          if (koodiArvo === "999903") {
            muutMaaraykset.push({
              koodi: koodiArvo,
              nimi: tutkintoNimi,
              selite: TUTKINTO_TEKSTIT.telma.selite,
              indeksi: muutMaaraykset.length + 1,
              maaraysId: uuid
            })
            return
          }

          // Alimääräykset
          if (aliMaaraykset) {
            tutkinto.rajoitteet = []
            _.forEach(aliMaaraykset, (alimaarays) => {
              const { koodi } = alimaarays
              const { koodiArvo, metadata } = koodi
              const nimi = parseLocalizedField(metadata)
              tutkinto.rajoitteet.push({ koodi: koodiArvo, nimi, maaraysId: uuid })
            })
          }

          // Määritetään määräyksissä olevat alat yläkoodeista
          _.forEach(ylaKoodit, (ylaKoodi) => {
            const ylaKoodiKoodiArvo = ylaKoodi.koodiArvo
            const ylaKoodiMetadata = ylaKoodi.metadata
            const ylakoodiMetadataArvo = parseLocalizedField(ylaKoodiMetadata)

            if (ylaKoodi.koodisto.koodistoUri === "isced2011koulutusalataso1") {
              tutkinto.koodi = koodiArvo
              tutkinto.nimi = tutkintoNimi
              tutkinto.alakoodi = ylaKoodiKoodiArvo
              tutkinto.alanimi = ylakoodiMetadataArvo
            } else if (ylaKoodi.koodisto.koodistoUri === "koulutustyyppi") {
              tutkinto.koulutustyyppikoodi = ylaKoodiKoodiArvo
              tutkinto.koulutustyyppi = ylakoodiMetadataArvo
            }
          })

          tutkinto.maaraysId = uuid

          tutkinnot.push(tutkinto)
          break
        }

        case KOODISTOT.AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS: {
          const { koodiarvo } = maarays

          const ammatillinenNimi = parseLocalizedField(maarays.koodi.metadata, 'FI', 'nimi', 'kieli')

          muutMaaraykset.push({
            selite: TUTKINTO_TEKSTIT.ammatilliseentehtavaanvalmistavakoulutus.selite,
            nimi: ammatillinenNimi,
            indeksi: muutMaaraykset.length + 1,
            maaraysId: uuid
          })
          break
        }

        case KOODISTOT.KULJETTAJAKOULUTUS: {
          const { koodiarvo } = maarays

          const kuljettajaSelite = parseLocalizedField(maarays.koodi.metadata, 'FI', 'kuvaus', 'kieli')

          muutMaaraykset.push({
            selite: kuljettajaSelite,
            nimi: "",
            indeksi: muutMaaraykset.length + 1,
            maaraysId: uuid
          })
          break
        }

        case KOODISTOT.OIVA_TYOVOIMAKOULUTUS: {

          const tyovoimaSelite = parseLocalizedField(maarays.koodi.metadata, 'FI', 'kuvaus', 'kieli')
          // TODO localizations

          muutMaaraykset.push({
            selite: tyovoimaSelite,
            nimi: "",
            indeksi: muutMaaraykset.length + 1,
            maaraysId: uuid
          })
          break
        }

        case KOODISTOT.OSAAMISALA: {
          break
        }

        default: {
          break
        }
      }
    })

    muutMaaraykset = _.sortBy(muutMaaraykset, (muuMaarays) => {
      return muuMaarays.indeksi
    })

    returnobj.maaraykset = sortTutkinnot(tutkinnot)
    returnobj.muutMaaraykset = muutMaaraykset

    // kohde 2: Opetuskieli
  } else if (target === KOHTEET.KIELI) {

      let opetuskielet = []
      let tutkintokieletEn = []
      let tutkintokieletSv = []
      let tutkintokieletFi = []
      let tutkintokieletRu = []

      _.forEach(maaraykset, (maarays) => {
          const {koodisto, uuid} = maarays
          const {koodi, aliMaaraykset} = maarays

          // Alimääräykset
          if (aliMaaraykset) {
              _.forEach(aliMaaraykset, (alimaarays) => {
                  const {koodi} = alimaarays
                  const {koodiArvo, metadata} = koodi
                  const nimi  = parseLocalizedField(maarays.koodi.metadata)
                  const tutkintokoodi = maarays.koodiarvo
                  switch (koodiArvo) {
                      case "EN":
                          tutkintokieletEn.push({koodi: koodiArvo, maaraysId: uuid, nimi, tutkintokoodi})
                          break
                      case "SV":
                          tutkintokieletSv.push({koodi: koodiArvo, maaraysId: uuid, nimi, tutkintokoodi})
                          break
                      case "RU":
                          tutkintokieletRu.push({koodi: koodiArvo, maaraysId: uuid, nimi, tutkintokoodi})
                          break
                      case "FI":
                          tutkintokieletFi.push({koodi: koodiArvo, maaraysId: uuid, nimi, tutkintokoodi})
                          break
                  }

              })
          }

          if(koodisto === KOODISTOT.OPPILAITOKSENOPETUSKIELI) {
              opetuskielet.push(maarays)
          }

      })

      returnobj.kohdeKuvaus = (opetuskielet.length > 1) ? LUPA_TEKSTIT.KIELI.VELVOLLISUUS_MONIKKO.FI : LUPA_TEKSTIT.KIELI.VELVOLLISUUS_YKSIKKO.FI
      returnobj.kohdeArvot = getMaaraysArvoArray(opetuskielet)
      returnobj.tutkinnotjakieletEn = tutkintokieletEn
      returnobj.tutkinnotjakieletSv = tutkintokieletSv
      returnobj.tutkinnotjakieletRu = tutkintokieletRu
      returnobj.tutkinnotjakieletFi = tutkintokieletFi

      // kohde 3: Toiminta-alueet
  } else if (target === KOHTEET.TOIMIALUE) {

    let toimintaalueet = getToimintaalueArvoArray(maaraykset)

    let maakunnat = _.filter(toimintaalueet, alue => {
      return alue.koodisto === 'maakunta'
    })

    let kunnat = _.filter(toimintaalueet, alue => {
      return alue.koodisto === 'kunta'
    })

    returnobj.maakunnat = maakunnat
    returnobj.kunnat = kunnat

    if(maakunnat.length > 1 && kunnat.length > 1) { returnobj.kohdeKuvaus = LUPA_TEKSTIT.TOIMINTA_ALUE.VELVOLLISUUS_MAAKUNTA_MONIKKO_KUNTA_MONIKKO.FI}
    if(maakunnat.length === 1 && kunnat.length > 1) { returnobj.kohdeKuvaus = LUPA_TEKSTIT.TOIMINTA_ALUE.VELVOLLISUUS_MAAKUNTA_YKSIKKO_KUNTA_MONIKKO.FI}
    if(maakunnat.length < 1 && kunnat.length > 1) { returnobj.kohdeKuvaus = LUPA_TEKSTIT.TOIMINTA_ALUE.VELVOLLISUUS_EIMAAKUNTA_KUNTA_MONIKKO.FI}

    if(maakunnat.length > 1 && kunnat.length === 1) { returnobj.kohdeKuvaus = LUPA_TEKSTIT.TOIMINTA_ALUE.VELVOLLISUUS_MAAKUNTA_MONIKKO_KUNTA_YKSIKKO.FI}
    if(maakunnat.length === 1 && kunnat.length === 1) { returnobj.kohdeKuvaus = LUPA_TEKSTIT.TOIMINTA_ALUE.VELVOLLISUUS_MAAKUNTA_YKSIKKO_KUNTA_YKSIKKO.FI}
    if(maakunnat.length < 1 && kunnat.length === 1) { returnobj.kohdeKuvaus = LUPA_TEKSTIT.TOIMINTA_ALUE.VELVOLLISUUS_EIMAAKUNTA_KUNTA_YKSIKKO.FI}

    if(maakunnat.length > 1 && kunnat.length < 1) { returnobj.kohdeKuvaus = LUPA_TEKSTIT.TOIMINTA_ALUE.VELVOLLISUUS_MAAKUNTA_MONIKKO_EIKUNTA.FI}
    if(maakunnat.length === 1 && kunnat.length < 1) { returnobj.kohdeKuvaus = LUPA_TEKSTIT.TOIMINTA_ALUE.VELVOLLISUUS_MAAKUNTA_YKSIKKO_EIKUNTA.FI}
    if(maakunnat.length < 1 && kunnat.length < 1) { returnobj.kohdeKuvaus = LUPA_TEKSTIT.TOIMINTA_ALUE.EI_VELVOLLISUUTTA.FI}

    _.filter(toimintaalueet, alue => {
        (alue.koodisto === 'nuts1') ? returnobj.kohdeKuvaus = LUPA_TEKSTIT.TOIMINTA_ALUE.VALTAKUNNALLINEN.FI : null
    })


    // kohde 4: opiskelijavuodet
  } else if (target === KOHTEET.OPISKELIJAVUODET) {

    let opiskelijavuodet = []

    _.forEach(maaraykset, (maarays) => {
      const { koodi, arvo } = maarays
      const { metadata } = koodi
      const tyyppi = parseLocalizedField(metadata)

      opiskelijavuodet.push({ arvo: arvo, tyyppi: tyyppi })
    })

    returnobj.opiskelijavuodet = opiskelijavuodet

    // kohde 5: Muut
  } else if (target === KOHTEET.MUUT) {

    let muut = []

    _.forEach(maaraykset, (maarays) => {
      const { koodi } = maarays
      const { metadata } = koodi

      if (koodi && metadata) {

        const type = parseLocalizedField(metadata, 'FI', 'nimi', 'kieli')
        const desc = parseLocalizedField(metadata, 'FI', 'kuvaus', 'kieli') || 'Ei kuvausta saatavilla'

        muut.push({ tyyppi: type, kuvaus: desc })
      }
    })

    returnobj.muut = muut
  }

  returnobj.heading = heading
  returnobj.tunniste = target
  returnobj.headingNumber = headingNumber

  return returnobj
}

function getMaaraysArvoArray(maaraykset) {
  let arr = []

  _.forEach(maaraykset, (maarays) => {
    const { koodi } = maarays

    if (koodi) {
      const { metadata } = koodi

      if (metadata) {
        arr.push(parseLocalizedField(metadata))
      }
    }
  })

  return arr
}

function getToimintaalueArvoArray(maaraykset) {
    let arr = []

    _.forEach(maaraykset, (maarays) => {
        const { koodi, koodisto } = maarays

        if (koodi) {
            const { metadata } = koodi

            if (metadata) {
                arr.push({arvo: parseLocalizedField(metadata), koodisto: koodisto })
            }
        }
    })

    return arr
}

function sortTutkinnot(tutkintoArray) {
  let obj = {}

  _.map(tutkintoArray, (tutkinto, i) => {
    const {
      alakoodi,
      alanimi,
      koodi,
      nimi,
      rajoitteet,
      koulutustyyppi,
      koulutustyyppikoodi,
      maaraysId
    } = tutkinto
    const ala = obj[alakoodi]
    let koulutusalaObj = {}
    const tutkintoObj = { koodi, nimi, maaraysId, rajoitteet }

    if (ala === undefined) {
      // Alaa ei ole alat-objektissa
      // Tehdään koulutusala-objekti ja lisätään se juuritason objektiin
      koulutusalaObj[koulutustyyppikoodi] = {
        koodi: koulutustyyppikoodi,
        nimi: koulutustyyppi,
        tutkinnot: [tutkintoObj]
      }
      obj[alakoodi] = {koodi: alakoodi, nimi: alanimi, koulutusalat: koulutusalaObj}
    } else {
      // Ala oli jo alat-objektissa
      // Tarkastetaan onko alalla koulutusalaa
      let koulAlaObj = ala.koulutusalat[koulutustyyppikoodi]

      if (koulAlaObj === undefined) {
        // koulutusalaa ei ollut koulutusaloissa, luodaan se
        ala.koulutusalat[koulutustyyppikoodi] = {
          koodi: koulutustyyppikoodi,
          nimi: koulutustyyppi,
          tutkinnot: [tutkintoObj]
        }
      } else {
        // koulutusala löytyi koulutusaloista, lisätään tutkinto koulutusalan tutkintoihib
        koulAlaObj.tutkinnot.push(tutkintoObj)
      }
    }
  })

  // Poistetaan mahdolliset tyhjät objektit
  obj = _.pickBy(obj, (ala) => {
    return ala.koodi !== undefined
  })

  // Järjestetään objektit numerojärjestykseen
  obj = _.sortBy(obj, (ala) => {
    _.forEach(ala.koulutusalat, (koulutusala) => {
      koulutusala.tutkinnot = _.sortBy(koulutusala.tutkinnot, (tutkinto) => {
        return tutkinto.koodi
      })
    })
    return ala.koodi
  })

  return obj
}

function parseMaaraykset(maaraykset, kohdeTunniste) {

    if (!maaraykset) {
        return null
    }

    if (kohdeTunniste != KOHTEET.KIELI) {
        return _.filter(maaraykset, (maarays) => {
            return maarays.kohde.tunniste === kohdeTunniste
        })
    }
    else {

        // oppilaitoksen opetuskieli
        let opetuskielet = _.filter(maaraykset, (maarays) => {
            return maarays.kohde.tunniste === KOHTEET.KIELI
        })

        // tutkintokielet
        let tutkintokielet = _.filter(maaraykset, (maarays) => {
            return maarays.kohde.tunniste === KOHTEET.TUTKINNOT
        })

        return _.concat(opetuskielet, tutkintokielet)
    }
}
