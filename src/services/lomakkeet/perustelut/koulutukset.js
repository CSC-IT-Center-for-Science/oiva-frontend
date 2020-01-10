import { HAKEMUS_OTSIKOT } from "../../../locales/uusiHakemusFormConstants";
// import { injectIntl } from "react-intl";

export const getKuljettajienJatkokoulutuslomake = (
  addPeopleFormCallback,
  isReadOnly,
  peopleForms
) => {
  const code = 6;
  return [
    {
      anchor: code,
      styleClasses: ["px-10 py-10"],
      components: [
        {
          anchor: "jatkokoulutus-title",
          name: "StatusTextRow",
          properties: {
            title: "Jatkokoulutusta antavan koulutuskeskuksen tehtävä"
          }
        }
      ],
      categories: [
        tehtavanTarpeellisuus(1, isReadOnly),
        voimassaOlo(2, isReadOnly),
        suunnitelma(3, isReadOnly),
        osaaminen(4, isReadOnly),
        johtaja(5, isReadOnly),
        opettajien(
          addPeopleFormCallback,
          peopleForms,
          6,
          "Selvitys jatkokoulutuksen opettajien kelpoisuuksista ja työkokemuksista",
          isReadOnly
        ),
        ajoneuvoKanta(7, isReadOnly),
        muutOpetusvalineet(8, isReadOnly)
      ]
    }
  ];
};

export const getKuljettajienPeruskoulutuslomake = (
  addPeopleFormCallback,
  isReadOnly,
  peopleForms
) => {
  const code = 5;
  return [
    {
      anchor: code,
      styleClasses: ["px-10 py-10"],
      components: [
        {
          anchor: "perustaso-title",
          name: "StatusTextRow",
          properties: {
            title:
              "Perustason ammattipätevyyskoulutusta antavan koulutuskeskuksen tehtävä "
          }
        }
      ],
      categories: [
        tehtavanTarpeellisuus(1, isReadOnly),
        voimassaOlo(2, isReadOnly),
        suunnitelma(3, isReadOnly),
        johtaja(4, isReadOnly),
        opettajien(
          addPeopleFormCallback,
          peopleForms,
          5,
          "Selvitys perustason ammattipätevyyskoulutusen opettajien kelpoisuuksista ja työkokemuksista",
          isReadOnly
        ),
        ajoneuvoKanta(6, isReadOnly),
        muutOpetusvalineet(7, isReadOnly)
      ]
    }
  ];
};

const tehtavanTarpeellisuus = (orderCode, isReadOnly) => {
  return {
    anchor: "tehtavan-tarpeellisuus",
    code: orderCode,
    title: "Tehtävän tarpeellisuus",
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    categories: [
      {
        anchor: "textbox",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "TextBox",
            properties: {
              isReadOnly,
              placeholder:
                "Perustelkaa tehtävän tarpeellisuus ensisijaisella toiminta-alueellanne"
            }
          }
        ]
      }
    ]
  };
};

const voimassaOlo = (orderCode, isReadOnly) => {
  return {
    anchor: "voimassaolo",
    code: orderCode,
    title:
      "Onko hakijalla voimassa olevaa Liikenne- ja turvallisuusviraston (Trafi) myöntämää lupaa järjestää ammattipätevyyskoulutusta?",
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    categories: [
      {
        anchor: "voimassaolo-field-no",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "RadioButtonWithLabel",
            properties: {
              isReadOnly,
              name: "voimassaolo-field-radio-no",
              code: 1,
              title: "Ei",
              labelStyles: {},
              isChecked: false.value,
              forChangeObject: {
                fieldName: "Ei"
              }
            }
          }
        ]
      },
      {
        anchor: "voimassaolo-field-yes",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "RadioButtonWithLabel",
            properties: {
              isReadOnly,
              name: "voimassaolo-field-radio-yes",
              code: 2,
              title: "Kyllä",
              labelStyles: {},
              isChecked: false,
              forChangeObject: {
                fieldName: "Kyllä"
              }
            }
          }
        ]
      }
    ]
  };
};

const suunnitelma = (orderCode, isReadOnly) => {
  return {
    anchor: "suunnitelma",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Suunnitelma ammattipätevyyskoulutuksen järjestämiseksi",
    categories: [
      {
        anchor: "suunnitelma-field",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "TextBox",
            properties: {
              isReadOnly,
              placeholder:
                "Toimintamalli ammattipätevyyskoulutuksen suunnittelusta ja toteutuksesta."
            }
          }
        ]
      }
    ]
  };
};

const osaaminen = (orderCode, isReadOnly) => {
  return {
    anchor: "osaaminen",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Koulutusohjelmien edellyttämä osaaminen",
    categories: [
      {
        anchor: "osaaminen-field",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "TextBox",
            properties: {
              isReadOnly,
              placeholder: "Kerro osaamisesta?"
            }
          }
        ]
      }
    ]
  };
};

const johtaja = (orderCode, isReadOnly) => {
  return {
    anchor: "johtaja",
    code: orderCode,
    title: "Opetuksesta vastaavan johtajan kelpoisuus ja työkokemus",
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    categories: [
      {
        anchor: `johtaja-info`,
        code: "!",
        styleClasses: ["pl-6"],
        title:
          "Valtioneuvoston asetus 434/2018 10 § Selvitys opetuksesta vastaavan johtajan/johtajien kelpoisuudesta ja työkokemuksesta toimipisteittäin.",
        components: [
          {
            anchor: "A",
            name: "TextBox",
            properties: {
              isReadOnly,
              placeholder: "Sana on vapaa..."
            }
          }
        ]
      },
      {
        anchor: "patevyydet",
        styleClasses: ["pl-6"],
        categories: [
          {
            anchor: "liikenneopettajalupa",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-liikenneopettajalupa",
                  title: "Liikenneopettajalupa (pakollinen)",
                  forChangeObject: {
                    fieldName: "Liikenneopettajalupa"
                  }
                }
              }
            ]
          },
          {
            anchor: "kuorma-autonkuljettaja",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-kuorma-autonkuljettaja",
                  title:
                    "Voimassa oleva kuorma-autonkuljettajan ammattipätevyys",
                  forChangeObject: {
                    fieldName:
                      "Voimassa oleva kuorma-autonkuljettajan ammattipätevyys"
                  }
                }
              }
            ]
          },
          {
            anchor: "linja-autonkuljettaja",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-linja-autonkuljettaja",
                  title:
                    "Voimassa oleva linja-autonkuljettajan ammattipätevyys",
                  forChangeObject: {
                    fieldName:
                      "Voimassa oleva linja-autonkuljettajan ammattipätevyys"
                  }
                }
              }
            ]
          }
        ]
      },
      {
        anchor: `paatoiminen-kuljettaja-info`,
        code: "a)",
        title:
          "Vähintään 1 vuoden kokemus johonkin seuraavista luokista kuuluvan ajoneuvonpäätoimisena kuljettajana:",
        styleClasses: ["pl-6 pt-6"],
        categories: [
          {
            anchor: "C-luokka",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-c-luokka",
                  title: "C-luokka",
                  forChangeObject: {
                    fieldName: "C-luokka"
                }
              }
            ]
          },
          {
            anchor: "CE-luokka",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-ce-luokka",
                  title: "CE-luokka",
                  forChangeObject: {
                    fieldName: "CE-luokka"
                  }
                }
              }
            ]
          },
          {
            anchor: "D-luokka",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-d-luokka",
                  title: "D-luokka",
                  forChangeObject: {
                    fieldName: "D-luokka"
                  }
                }
              }
            ]
          }
        ]
      },
      {
        anchor: `jokin-tutkinnoista`,
        code: "b)",
        title: "Jokin seuraavista tutkinnoista:",
        styleClasses: ["pl-6 pt-6"],
        categories: [
          {
            anchor: "linja-auto-ammattitutkinto",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-linja-auto-ammattitutkinto",
                  title: "Linja-auton kuljettajan ammattitutkinto",
                  forChangeObject: {
                    fieldName: "Linja-auton kuljettajan ammattitutkinto"
                  }
                }
              }
            ]
          },
          {
            anchor: "yhdistelmäajoneuvo-ammattitutkinto",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-yhdistelmäajoneuvo-ammattitutkinto",
                  title: "Yhdistelmäajoneuvonkuljettajan ammattitutkinto",
                  forChangeObject: {
                    fieldName: "Yhdistelmäajoneuvonkuljettajan ammattitutkinto"
                  }
                }
              }
            ]
          },
          {
            anchor: "puutavara-autokuljetus-ammattitutkinto",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-puutavara-autokuljetus-ammattitutkinto",
                  title: "Puutavaran autonkuljetuksen ammattitutkinto",
                  forChangeObject: {
                    fieldName: "Puutavaran autonkuljetuksen ammattitutkinto"
                  }
                }
              }
            ]
          },
          {
            anchor: "kuljetuspalvelut-logistiikan-perustutkinto",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-kuljetuspalvelut-logistiikan-perustutkinto",
                  title:
                    "Kuljetuspalvelujen koulutusohjelmassa suoritettu logistiikan perustutkinto",
                  forChangeObject: {
                    fieldName: "Kuljetuspalvelujen koulutusohjelmassa suoritettu logistiikan perustutkinto"
                  }
                }
              }
            ]
          },
          {
            anchor: "kuljetusalan-ammattitutkinto",
            styleClasses: ["pl-0"],
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: false,
                  isReadOnly,
                  labelStyles: {},
                  name: "checkbox-kuljetusalan-ammattitutkinto",
                  title: "Kuljetusalan ammattitutkinto",
                  forChangeObject: {
                    fieldName: "Kuljetusalan ammattitutkinto"
                  }
                }
              }
            ]
          }
        ]
      },
      {
        anchor: "liitteet",
        styleClasses: ["pl-6 pt-6"],
        title: "Liitteet",
        components: [
          {
            anchor: "info",
            name: "StatusTextRow",
            styleClasses: ["w-full"],
            properties: {
              title: HAKEMUS_OTSIKOT.LIITE_OHJE.FI,
              isHidden: isReadOnly
            }
          },
          {
            anchor: "A",
            styleClasses: ["w-full"],
            name: "Attachments",
            properties: {
              isReadOnly
            }
          }
        ]
      }
    ]
  };
};

const opettajien = (
  addPeopleFormCallback,
  peopleForms,
  orderCode,
  helpText,
  isReadOnly
) => {
  return {
    anchor: "opettajien-kelpoisuus-ja-tyokokemus",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Opettajien kelpoisuus ja työkokemus",
    categories: [
      {
        anchor: `opettajien-kelpoisuus-ja-tyokokemus-lakiteksti`,
        code: "!",
        title:
          "Valtioneuvoston asetus 434/2018 10 §. Selvitys perustason ammattipätevyyskoulutusen opettajien kelpoisuuksista ja työkokemuksista.",
        styleClasses: ["pl-6"]
      },
      {
        anchor: `opettajien-kelpoisuus-ja-tyokokemus-info`,
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "StatusTextRow",
            styleClasses: ["py-4 text-base"],
            properties: {
              title: helpText
            }
          },
          {
            anchor: `lisaa-henkilo-painike`,
            name: "SimpleButton",
            onClick: addPeopleFormCallback,
            styleClasses: "flex justify-end",
            properties: {
              isReadOnly,
              text: "Lisää henkilö"
            }
          }
        ]
      },
      {
        anchor: "lisatyt-henkilot",
        styleClasses: ["pt-6"],
        categories: peopleForms
      }
    ]
  };
};

const ajoneuvoKanta = (orderCode, isReadOnly) => {
  return {
    anchor: "ajoneuvokanta",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Ajoneuvokanta",
    categories: [
      {
        anchor: `ajoneuvokanta-kentat`,
        styleClasses: ["pl-6"],
        title:
          "Selvitys opetuksessa käytettävästä ajoneuvokannasta ja opetusvälineistä ja niiden soveltuvuudesta ammattipätevyyskoulutukseen.",

        components: [
          {
            anchor: "linja-autoja",
            name: "Input",
            styleClasses: ["mt-6"],
            properties: {
              fullWidth: true,
              isReadOnly,
              label: "Linja-autoja",
              placeholder: "Linja-autoja",
              type: "number"
            }
          },
          {
            anchor: "kuorma-autoja",
            name: "Input",
            styleClasses: ["mt-6"],
            properties: {
              fullWidth: true,
              isReadOnly,
              label: "Kuorma-autoja",
              placeholder: "Kuorma-autoja",
              type: "number"
            }
          },
          {
            anchor: "peravaunuja",
            name: "Input",
            styleClasses: ["mt-6"],
            properties: {
              fullWidth: true,
              isReadOnly,
              label: "Perävaunuja",
              placeholder: "Perävaunuja",
              type: "number"
            }
          }
        ]
      },
      {
        anchor: "liitteet",
        styleClasses: ["pl-6 pt-6"],
        title: "Liitteet",
        components: [
          {
            anchor: "info",
            name: "StatusTextRow",
            styleClasses: ["w-full"],
            properties: {
              title: HAKEMUS_OTSIKOT.LIITE_OHJE.FI,
              isHidden: isReadOnly
            }
          },
          {
            anchor: "A",
            styleClasses: ["w-full"],
            name: "Attachments",
            properties: {
              isReadOnly
            }
          }
        ]
      }
    ]
  };
};

const muutOpetusvalineet = (orderCode, isReadOnly) => {
  return {
    anchor: "muut-opetusvalineet",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Muut opetusvälineet",
    categories: [
      {
        anchor: `asetuksen-mukaiset`,
        code: "!",
        styleClasses: ["pl-6"],
        title:
          "Asetuksen mukaiset opetus- ja havaintovälineet (VnAsetus 434/2018, 11 § 1 ja 2 mom.)",
        components: [
          {
            anchor: "A",
            name: "TextBox",
            properties: {
              isReadOnly
            }
          }
        ]
      },
      {
        anchor: "muut",
        styleClasses: ["pl-6"],
        title: "Muut opetus- ja havaintovälineet",

        components: [
          {
            anchor: "B",
            name: "TextBox",
            properties: {
              isReadOnly,
              labelStyles: {},
              placeholder:
                "Muut oppilaitoksen oppimisympäristöissä tapahtuvaan osaamisen hankkimiseen liittyvät välineet"
            }
          }
        ]
      }
    ]
  };
};
