import { getMuutostarveCheckboxes } from "./common";
import * as R from "ramda";

export const getVankilaopetusPerustelulomake = (
  vankilat = [],
  isReadOnly,
  locale = "FI"
) => {
  const localeUpper = R.toUpper(locale);
  return [
    {
      anchor: "vankilaopetus",
      layout: {
        indentation: "large",
        strategy: {
          key: "groups"
        }
      },
      title: "Vankilaopetuksen järjestämistehtävä",
      categories: [
        {
          anchor: "tehtavan-tarpeellisuus",
          code: 1,
          layout: {
            strategy: {
              key: "groups"
            }
          },
          styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
          title: "Tehtävän tarpeellisuus",
          categories: [
            {
              anchor: "perustelut",
              components: [
                {
                  anchor: "A",
                  isReadOnly,
                  name: "TextBox",
                  properties: {
                    title:
                      "Perustelkaa tehtävän tarpeellisuus ensisijaisella toiminta-alueellanne",
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
          layout: {
            strategy: {
              key: "groups"
            }
          },
          styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
          title: "Toiminnalliset edellytykset vankilaopetuksen järjestämiseksi",
          categories: [
            {
              anchor: "resurssit-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Haetun tehtävän edellyttämät henkilöstöresurssit (mm. kelpoisuusehdot täyttävän opetushenkilöstön tai muu tehtävän edellyttämä henkilöstön määrä, sekä rekrytoitavien määrä). Huom. Henkilötietoja ei tule antaa lomakkeella.",
                    title: "Henkilöstöresurssit",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "osaaminen-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Haetun tehtävän järjestämisen edellyttämä osaaminen vaativasta erityisestä tuesta (mm. HOKS-prosessi, tuki- ja ohjauspalvelut).",
                    title: "Osaaminen",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "jarjestelyt-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Haetun tehtävän edellyttämät pedagogiset järjestelyt (mm. opetusjärjestelyt, oppimisympäristöt, tilat ja välineet).",
                    title: "Pedagogiset järjestelyt",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "yhteistyo-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Haetun tehtävän edellyttämä työelämäpalvelu ja muu sidosryhmäyhteistyö (mm. toimijat, toiminta- ja yhteistyömuodot).",
                    title: "Sidosryhmäyhteistyö",
                    value: ""
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: "vankilaopetuksen-toteuttaminen",
          code: 3,
          styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
          title: "Vankilaopetuksen toteuttaminen",
          categories: [
            {
              anchor: "autocomplete-perustelut",
              styleClasses: ["pl-6 pt-6"],
              components: [
                {
                  anchor: "A",
                  name: "Autocomplete",
                  styleClasses: ["pb-4 text-base"],
                  properties: {
                    isReadOnly,
                    options: R.sortBy(
                      R.prop("label"),
                      R.map(vankila => {
                        return {
                          label: vankila.metadata[localeUpper].nimi,
                          value: vankila.koodiarvo
                        };
                      }, vankilat)
                    ),
                    title:
                      "Valitkaa listasta ne vankilat, joissa suunnittelette järjestävänne vankilaopetusta.",
                    value: ""
                  }
                }
              ]
            }
          ]
        },
        opiskelijavuodet(4, 4, isReadOnly)
      ]
    }
  ];
};

export const getVaativaErityinenTukilomake = isReadOnly => {
  return [
    {
      anchor: "vaativa-erityinen-tuki-perustelut-lomake",
      layout: {
        margins: { top: "small" },
        strategy: {
          key: "groups"
        }
      },
      categories: [
        {
          anchor: `A`,
          code: 1,
          styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
          title: "Tehtävän tarpeellisuus",
          categories: [
            {
              anchor: "toiminta-alue-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    title:
                      "Perustelkaa tehtävän tarpeellisuus ensisijaisella toiminta-alueellanne",
                    value: ""
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: `B`,
          code: 2,
          styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
          title:
            "Toiminnalliset edellytykset laajennetun oppisopimus järjestämistehtävän järjestämiseksi",
          categories: [
            {
              anchor: "henkilostoresurssit-perustelut",
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Haetun tehtävän edellyttämät henkilöstöresurssit (mm. kelpoisuusehdot täyttävän opetushenkilöstön tai muu tehtävän edellyttämä henkilöstön määrä, sekä rekrytoitavien määrä). Huom. Henkilötietoja ei tule antaa lomakkeella.",
                    title: "Henkilöstöresurssit",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "osaaminen-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Haetun tehtävän järjestämisen edellyttämä osaaminen vaativasta erityisestä tuesta (mm. HOKS-prosessi, tuki- ja ohjauspalvelut).",
                    title: "Osaaminen",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "jarjestelyt-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Haetun tehtävän edellyttämät pedagogiset järjestelyt (mm. opetusjärjestelyt, oppimisympäristöt, tilat ja välineet).",
                    title: "Pedagogiset järjestelyt",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "sidosryhmayhteistyo-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Haetun tehtävän edellyttämä työelämäpalvelu ja muu sidosryhmäyhteistyö (mm. toimijat, toiminta- ja yhteistyömuodot).",
                    title: "Sidosryhmäyhteistyö",
                    value: ""
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: `C`,
          code: 3,
          styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
          title: "Suunnitelma vaativan erityisen tuen tehtävän järjestämiseksi",
          categories: [
            {
              anchor: "suunnitelma-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Toimintamalli vaativan erityisen tuen tehtävän järjestämisen suunnittelusta ja toteutuksesta (strateginen suunnitelma, käytännön toteutusmalli ja laadun seuranta).",
                    title: "Toimintamalli",
                    value: ""
                  }
                }
              ]
            }
          ]
        },
        opiskelijavuodet(4, 4, isReadOnly)
      ]
    }
  ];
};

export const getOppisopimusPerusteluLomake = isReadOnly => {
  const code = 4;
  return [
    {
      anchor: "oppisopimus-perustelut-lomake",
      styleClasses: ["px-10 py-10"],
      categories: [
        {
          anchor: `${code}-1-perustelut`,
          code: 1,
          styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
          title: "Tehtävän tarpeellisuus",
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                isReadOnly,
                title:
                  "Perustelkaa tehtävän tarpeellisuus ensisijaisella toiminta-alueellanne",
                value: ""
              }
            }
          ]
        },
        {
          anchor: `${code}-2`,
          code: 2,
          styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
          title:
            "Toiminnalliset edellytykset laajennetun oppisopimus järjestämistehtävän järjestämiseksi",
          categories: [
            {
              anchor: "henkilostoresurssit-perustelut",
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Haetun tehtävän edellyttämät henkilöstöresurssit (mm. tehtävän edellyttämä henkilöstön määrä, sekä rekrytoitavien määrä). Huom. Henkilötietoja ei tule antaa lomakkeella.",
                    title: "Henkilöstöresurssit",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "osaaminen-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
                    placeholder:
                      "Haetun tehtävän järjestämisen edellyttämä osaaminen (mm. palveluprosessi, hankintaosaaminen, johtaminen ja sopimusten valvonta).",
                    title: "Osaaminen",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "sidosryhmayhteistyo-perustelut",
              styleClasses: ["pl-6"],
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    isReadOnly,
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
        opiskelijavuodet(3, 3, isReadOnly)
      ]
    }
  ];
};

export const generateDifferenceComponent = ({
  titles,
  changeObject = {},
  isReadOnly = false,
  isRequired = false,
  name = ""
}) => {
  return {
    anchor: "A",
    name: "Difference",
    properties: {
      initialValue: changeObject.initialValue || 0,
      applyForValue: changeObject.applyForValue || 0,
      titles,
      isReadOnly,
      isRequired,
      name
    }
  };
};

export const getOpiskelijavuodetVahimmaisopiskelijavuosimaaraPerustelulomake = (
  checkboxItems,
  locale,
  isReadOnly = false,
  changeObject,
  differenceComponentTitles
) => {
  const checkboxes = getMuutostarveCheckboxes(
    checkboxItems,
    locale,
    isReadOnly
  );
  console.info(checkboxes);
  return [
    {
      anchor: "vahimmaisopiskelijavuodet",
      title: "Haettava määrä",
      components: [
        generateDifferenceComponent({
          changeObject,
          titles: differenceComponentTitles,
          isReadOnly: true
        })
      ]
    },
    {
      anchor: "perustelut",
      title: "Mikä on aiheuttanut muutostarpeen?",
      categories: checkboxes
    },
    {
      anchor: "2",
      categories: [
        {
          layout: {
            indentation: "none"
          },
          anchor: "tehtavan-tarpeellisuus-field",
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                isReadOnly,
                placeholder:
                  "Perustele lyhyesti miksi tälle muutokselle on tarvetta"
              }
            }
          ]
        }
      ]
    }
  ];
};

const opiskelijavuodet = (code, anchorNumber, isReadOnly) => {
  const year = new Date().getFullYear();
  return {
    anchor: `${code}-${anchorNumber}`,
    code,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Arvio koulutukseen suunnattavista opiskelijavuosista",
    categories: [
      {
        anchor: `${code}-${anchorNumber}`,
        components: [
          {
            anchor: "opiskelijavuodet-header",
            name: "StatusTextRow",
            styleClasses: ["font-semibold"],
            properties: {
              isReadOnly,
              labelStyles: {},
              title:
                "Merkitkää arvionne tehtävään kohdistettavista opiskelijavuosista po. vuosina.",
              value: ""
            }
          }
        ],
        categories: [
          {
            anchor: "vuodet",
            layout: {
              indentation: "none"
            },
            styleClasses: ["flex sm:row"],
            components: [
              {
                anchor: "A",
                name: "Input",
                styleClasses: ["mr-8"],
                properties: {
                  forChangeObject: {
                    year: (year + 1).toString()
                  },
                  isReadOnly,
                  withoutMargin: true,
                  label: (year + 1).toString(),
                  type: "number",
                  width: "7em",
                  value: ""
                }
              },
              {
                anchor: "B",
                name: "Input",
                styleClasses: ["mr-8"],
                properties: {
                  forChangeObject: {
                    year: (year + 2).toString()
                  },
                  isReadOnly,
                  withoutMargin: true,
                  label: (year + 2).toString(),
                  type: "number",
                  width: "7em",
                  value: ""
                }
              },
              {
                anchor: "C",
                name: "Input",
                properties: {
                  forChangeObject: {
                    year: (year + 3).toString()
                  },
                  isReadOnly,
                  withoutMargin: true,
                  label: (year + 3).toString(),
                  type: "number",
                  width: "7em",
                  value: ""
                }
              }
            ]
          }
        ]
      }
    ]
  };
};
