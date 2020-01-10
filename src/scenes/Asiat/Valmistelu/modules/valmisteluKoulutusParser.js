import _ from 'lodash'
import { parseLocalizedField } from "../../../../modules/helpers"
import { getKoulutusAlat } from "./valmisteluUtils"

const keys = {
    KEY_01: '01',
    KEY_02: '02',
    KEY_03: '03',
    KEY_04: '04',
    KEY_05: '05',
    KEY_06: '06',
    KEY_07: '07',
    KEY_08: '08',
    KEY_09: '09',
    KEY_10: '10'
}

export const parseKoulutukset = (koulutusdata, koodiarvo, metadata) => {

    if (koulutusdata && koodiarvo && metadata) {
        const name = parseLocalizedField(metadata)

        let koulutusArray = []
        let kouluksetObj = {}

        kouluksetObj.koodiarvo = koodiarvo
        kouluksetObj.metadata = metadata
        kouluksetObj.nimi = name

        _.forEach(koulutusdata, (data) => {
            const { koodiArvo, metadata, versio } = data
            // TODO: selvitetään mikä on oikea versiokäytäntö
            // if (versio !== 8 && versio !== 9) {
            //   console.log(`koulutusalan koodiarvolla: ${koodiarvo} löytyi koulutus: ${koodiArvo} ${parseLocalizedField(metadata)} versiolla: ${versio}`)
            // }
            // toistaiseksi käytetään vain koulutuksia versiolla 8
            if (versio && versio === 8) {
                koulutusArray.push({
                    koodiarvo: koodiArvo,
                    nimi: parseLocalizedField(metadata)
                })
            }
        })

        kouluksetObj.koulutukset = koulutusArray

        return kouluksetObj

    }
}

export const parseKoulutuksetAll = (koulutusdata) => {
    let koulutukset = {}
    const koulutusalat = getKoulutusAlat()

    koulutusalat.forEach(ala => {
        const { koodiArvo, metadata } = ala

        if (koodiArvo !== "00" || koodiArvo !== "99") {
            koulutukset[koodiArvo] = { koodiArvo, metadata, koulutukset: [] }
        }
    })

    koulutusdata.forEach(koulutus => {
        const { koulutusalaKoodiArvo } = koulutus

        switch (koulutusalaKoodiArvo) {
            case keys.KEY_01: {
                koulutukset[keys.KEY_01].koulutukset.push(koulutus)
                break
            }

            case keys.KEY_02: {
                koulutukset[keys.KEY_02].koulutukset.push(koulutus)
                break
            }

            case keys.KEY_03: {
                koulutukset[keys.KEY_03].koulutukset.push(koulutus)
                break
            }

            case keys.KEY_04: {
                koulutukset[keys.KEY_04].koulutukset.push(koulutus)
                break
            }

            case keys.KEY_05: {
                koulutukset[keys.KEY_05].koulutukset.push(koulutus)
                break
            }

            case keys.KEY_06: {
                koulutukset[keys.KEY_06].koulutukset.push(koulutus)
                break
            }

            case keys.KEY_07: {
                koulutukset[keys.KEY_07].koulutukset.push(koulutus)
                break
            }

            case keys.KEY_08: {
                koulutukset[keys.KEY_08].koulutukset.push(koulutus)
                break
            }

            case keys.KEY_09: {
                koulutukset[keys.KEY_09].koulutukset.push(koulutus)
                break
            }

            case keys.KEY_10: {
                koulutukset[keys.KEY_10].koulutukset.push(koulutus)
                break
            }

            default: {
                break
            }
        }
    })

    // remove duplicates
    _.forEach(koulutukset, koulutusala => {
        koulutusala.koulutukset = _.uniqBy(koulutusala.koulutukset, 'koodiArvo')
    })

    return koulutukset
}

export function parseKoulutusalat(koulutusalat) {
    if (!koulutusalat) {
        return null
    }

    return _.filter(koulutusalat, ala => {
        return ala.koodiArvo !== "00" && ala.koodiArvo !== "99"
    })
}
