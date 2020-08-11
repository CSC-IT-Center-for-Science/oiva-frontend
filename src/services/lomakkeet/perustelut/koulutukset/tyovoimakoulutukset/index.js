import opiskelijavuodet from "../../lomakeosiot/opiskelijavuodet";
import getDefaultRemovalForm from "../../lomakeosiot/poistolomake";
import * as R from "ramda";

function getAdditionForm(code, elykeskukset = [], isReadOnly, locale = "FI") {
  return [
    {
      anchor: code,
      title: "Työvoimakoulutuksen tehtävä",
      categories: [
        {
          anchor: "tehtavan-tarpeellisuus",
          code: 1,
          title: "Tehtävän tarpeellisuus",
          categories: [
            {
              anchor: "ensisijaisella-toiminta-alueella",
              components: [
                {
                  anchor: "textbox",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    isRequired: true,
                    placeholder:
                      "Perustelkaa tehtävän tarpeellisuus ensisijaisella toiminta-alueellanne",
                    title:
                      "Tehtävän tarpeellisuus ensisijaisella toiminta-alueella",
                    value: ""
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: "toiminnalliset-edellytykset",
          code: 2,
          title:
            "Toiminnalliset edellytykset laajennetun oppisopimus järjestämistehtävän järjestämiseksi",
          categories: [
            {
              anchor: "henkilostoresurssit",
              components: [
                {
                  anchor: "textbox",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    isRequired: true,
                    placeholder:
                      "Haetun tehtävän edellyttämät henkilöstöresurssit (mm. tehtävän edellyttämä henkilöstön määrä, sekä rekrytoitavien määrä). Huom. Henkilötietoja ei tule antaa lomakkeella.",
                    title: "Henkilöstöresurssit",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "osaaminen",
              components: [
                {
                  anchor: "textbox",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    isRequired: true,
                    placeholder:
                      "Haetun tehtävän järjestämisen edellyttämä osaaminen (mm. palveluprosessi, hankintaosaaminen, johtaminen ja sopimusten valvonta).",
                    title: "Osaaminen",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "jarjestelyt",
              components: [
                {
                  anchor: "textbox",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    isRequired: true,
                    placeholder:
                      "Haetun tehtävän edellyttämät pedagogiset järjestelyt (mm. opetusjärjestelyt, oppimisympäristöt, tilat ja välineet).",
                    title: "Pedagogiset järjestelyt",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "sidosryhmayhteistyo",
              components: [
                {
                  anchor: "textbox",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    isRequired: true,
                    placeholder:
                      "Haetun tehtävän edellyttämät toimivat ja kokonaisvaltaiset työelämäyhteydet ja -palvelut ja muu sidosryhmäyhteistyö (mm. toimijat, toiminta- ja yhteistyömuodot).",
                    title: "Sidosryhmäyhteistyö",
                    value: ""
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: "suunnitelma",
          code: 3,
          title: "Suunnitelma työvoimakoulutuksen järjestämiseksi",
          categories: [
            {
              anchor: "suunnitelma-field",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "textbox",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    isRequired: true,
                    placeholder:
                      "mm. koulutusalat, joille työvoimakoulutusta aiotaan järjestää",
                    title:
                      "Toimintamalli työvoimakoulutuksen suunnittelusta ja toteutuksesta",
                    value: ""
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: "yhteistyo",
          code: 4,
          title: "ELY-keskusten kanssa suunniteltu yhteistyö",
          categories: [
            {
              anchor: "elykeskukset",
              components: [
                {
                  anchor: "autocomplete",
                  name: "Autocomplete",
                  styleClasses: ["pb-4 text-base"],
                  properties: {
                    isReadOnly,
                    options: R.sortBy(
                      R.prop("label"),
                      R.map(elykeskus => {
                        return {
                          label: R.find(
                            R.propEq("kieli", locale),
                            elykeskus.metadata
                          ).nimi,
                          value: elykeskus.koodiArvo
                        };
                      }, elykeskukset || [])
                    ),
                    title:
                      "Valitkaa listasta ne ELY-keskukset joiden kanssa suunnittelette tekevänne yhteistyötä työvoimakoulutuksen järjestämisessä.",
                    value: ""
                  }
                }
              ]
            }
          ]
        },
        opiskelijavuodet(5, 4, isReadOnly)
      ]
    }
  ];
}

export default function getTyovoimakoulutuksetPerustelulomake(
  action,
  data,
  isReadOnly,
  locale,
  prefix
) {
  switch (action) {
    case "addition":
      return getAdditionForm(
        data.code,
        data.elykeskukset,
        isReadOnly,
        R.toUpper(locale)
      );
    case "removal":
      return getDefaultRemovalForm(isReadOnly, prefix);
    default:
      return [];
  }
}
