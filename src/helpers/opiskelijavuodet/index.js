import * as R from "ramda";

// Magic constants

// 23 = Ei velvollisuutta järjestää tutkintoja ja valmentavaa
// koulutusta vaativaan erityiseen tukeen oikeutetuille opiskelijoille
export const vaativatukiNotSelectedKoodiarvo = "23";

// Mikäli jokin näistä koodeista on valittuna osiossa 5, näytetään vaativaa tukea koskevat kentät osiossa 4.
export const vaativatCodes = ["2", "16", "17", "18", "19", "20", "21"];

const sisaoppilaitosOpiskelijamaaraKoodiarvo = "4";

export const findVaativatukiRajoitus = (rajoitukset) =>
    R.find(R.propSatisfies(x => R.includes(x, vaativatCodes), "koodiarvo"), rajoitukset);

export const findSisaoppilaitosRajoitus = (rajoitukset) =>
    R.find(R.propSatisfies(x => R.not(R.includes(x, vaativatCodes)), "koodiarvo"), rajoitukset);

export function createChangeObjects(
    changeObjects = {},
    backendMuutokset = [],
    kohde,
    maaraystyypit,
    muut,
    lupamuutokset,
    muutMuutokset
) {

    // TODO: Fill perustelut and liitteet

    const unhandledChangeObjects = changeObjects.muutokset;

    const uudetMuutokset = R.map(changeObj => {
        const anchorParts = R.split(".", changeObj.anchor);
        const koodiarvo = changeObj.properties.metadata.koodiarvo;
        let koodisto = { koodistoUri: "koulutussektori" };
        const isVahimmaismaara = R.equals(
            "vahimmaisopiskelijavuodet",
            R.nth(1, anchorParts)
        );
        if (!isVahimmaismaara) {
            koodisto = (R.find(R.propEq("koodiArvo", koodiarvo), muut) || {})
                .koodisto;
        }
        const anchorInit = R.compose(
            R.join("."),
            R.init,
            R.split(".")
        )(changeObj.anchor);

        let anchor = "";

        if (anchorInit === "opiskelijavuodet.vahimmaisopiskelijavuodet")
            anchor = "perustelut_opiskelijavuodet_vahimmaisopiskelijavuodet";
        else if (anchorInit === "opiskelijavuodet.vaativatuki")
            anchor = "perustelut_opiskelijavuodet_vaativatuki";
        else if (anchorInit === "opiskelijavuodet.sisaoppilaitos")
            anchor = "perustelut_opiskelijavuodet_sisaoppilaitos";

        const perustelut = R.filter(
            R.compose(R.includes(anchor), R.prop("anchor")),
            changeObjects.perustelut
        );

        const perustelutForBackend = changeObjects;

        const perusteluteksti = perustelutForBackend
            ? null
            : R.map(perustelu => {
                if (R.path(["properties", "value"], perustelu)) {
                    return { value: R.path(["properties", "value"], perustelu) };
                }
                return {
                    value: R.path(["properties", "metadata", "fieldName"], perustelu)
                };
            }, perustelut);

        let meta = Object.assign(
            {},
            {
                tunniste: "tutkintokieli",
                changeObjects: R.flatten([[changeObj], perustelut]),
                muutosperustelukoodiarvo: []
            },
            perustelutForBackend,
            perusteluteksti ? { perusteluteksti } : null
        );

        let muutokset = [
            {
                arvo: changeObj.properties.applyForValue,
                kategoria: R.head(anchorParts),
                koodiarvo,
                koodisto: koodisto.koodistoUri,
                kohde,
                maaraystyyppi: isVahimmaismaara
                    ? R.find(R.propEq("tunniste", "OIKEUS"), maaraystyypit)
                    : R.find(R.propEq("tunniste", "RAJOITE"), maaraystyypit),
                meta,
                tila: "LISAYS"
            }
        ];

        // Add removal change if old maarays exists
        const maaraysUuid = R.path(
            ["properties", "metadata", "maaraysUuid"],
            changeObj
        );
        if (maaraysUuid) {
            muutokset = R.append({
                ...muutokset[0],
                meta: {},
                maaraysUuid: maaraysUuid,
                tila: "POISTO"
            })(muutokset);
        }

        return muutokset;
    }, unhandledChangeObjects).filter(Boolean);

    const findChange = (anchorStart, changeObjects) =>
        R.find(R.compose(R.startsWith(anchorStart), R.prop("anchor")), changeObjects);

    const findIsChecked = anchorStart =>
        R.path(["properties", "isChecked"], findChange(anchorStart, muutMuutokset));

    const rajoitukset = R.compose(
            R.prop("rajoitukset"),
            R.head,
            R.values,
            R.filter(R.propEq("tunniste", "opiskelijavuodet"))
        )(lupamuutokset);

    const generateMuutosFromMaarays = maarays => ({
        kategoria: "opiskelijavuodet",
        koodiarvo: maarays.koodiarvo,
        koodisto: maarays.koodisto,
        kohde: maarays.kohde,
        maaraysUuid: maarays.maaraysUuid,
        maaraystyyppi: R.find(R.propEq("tunniste", "RAJOITE"), maaraystyypit),
        meta: {},
        tila: "POISTO"
    });

    // If last radio selection (23) is selected, vuosimaara should be removed
    if (findIsChecked("muut_02.vaativatuki." + vaativatukiNotSelectedKoodiarvo)) {
        const vaativatukiMaarays = findVaativatukiRajoitus(rajoitukset);
        uudetMuutokset.push(generateMuutosFromMaarays(vaativatukiMaarays));
    }

    // If sisaoppilaitos is changed to false, vuosimaara should be removed
    if (findIsChecked("muut_03.sisaoppilaitos." + sisaoppilaitosOpiskelijamaaraKoodiarvo) === false) {
        const sisaoppilaitosMaarays = findSisaoppilaitosRajoitus(rajoitukset);
        uudetMuutokset.push(generateMuutosFromMaarays(sisaoppilaitosMaarays));
    }

    return R.flatten([uudetMuutokset]);
}
