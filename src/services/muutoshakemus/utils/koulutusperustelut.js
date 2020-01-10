import * as R from "ramda";

const handleClickOfAddPeople = payload => {
  console.info(payload);
};

export const getKuljettajakoulutusPerustelulomakeByCode = code => {
  const forms = {
    "3": [
      {
        anchor: `${code}`,
        title: "",
        components: [
          {
            anchor: "perustele-label",
            name: "StatusTextRow",
            properties: {
              labelStyles: {},
              withoutMargin: true,
              title: "Perustele lyhyesti miksi tälle muutokselle on tarvetta"
            }
          },
          {
            anchor: "A",
            name: "TextBox"
          }
        ]
      }
    ],
    "4": [
      {
        anchor: `${code}-1`,
        title: "Jatkokoulutusta antavan koulutuskeskuksen tehtävä",
        components: [
          {
            anchor: "tehtavan-tarpeellisuus-label",
            name: "StatusTextRow",
            properties: {
              code: 1,
              labelStyles: {},
              title: "Tehtävän tarpeellisuus"
            }
          }
        ],
        categories: [
          {
            anchor: "tehtavan-tarpeellisuus-field",
            components: [
              {
                anchor: "A",
                name: "TextBox",
                properties: {
                  placeholder:
                    "Perustelkaa tehtävän tarpeellisuus ensisijaisella toiminta-alueellanne"
                }
              }
            ]
          }
        ]
      },
      {
        anchor: `${code}-2`,
        components: [
          {
            anchor: "voimassaolo-label",
            name: "StatusTextRow",
            properties: {
              code: 2,
              labelStyles: {},
              title:
                "Onko hakijalla voimassa olevaa Liikenne- ja turvallisuusviraston (Trafi) myöntämää lupaa järjestää ammattipätevyyskoulutusta?"
            }
          }
        ],
        categories: [
          {
            anchor: "voimassaolo-field-no",
            components: [
              {
                anchor: "A",
                name: "RadioButtonWithLabel",
                properties: {
                  name: "voimassaolo-field-radio-no",
                  code: 1,
                  title: "Ei",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName: "Ei"
                  }
                }
              }
            ]
          },
          {
            anchor: "voimassaolo-field-yes",
            components: [
              {
                anchor: "A",
                name: "RadioButtonWithLabel",
                properties: {
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
      },
      {
        anchor: `${code}-3`,
        components: [
          {
            anchor: "suunnitelma-label",
            name: "StatusTextRow",
            properties: {
              code: 3,
              labelStyles: {},
              title: "Suunnitelma ammattipätevyyskoulutuksen järjestämiseksi"
            }
          }
        ],
        categories: [
          {
            anchor: "suunnitelma-field",
            components: [
              {
                anchor: "A",
                name: "TextBox",
                properties: {
                  placeholder:
                    "Toimintamalli ammattipätevyyskoulutuksen suunnittelusta ja toteutuksesta."
                }
              }
            ]
          }
        ]
      },
      {
        anchor: `${code}-4`,
        components: [
          {
            anchor: "osaaminen-label",
            name: "StatusTextRow",
            properties: {
              code: 4,
              labelStyles: {},
              title: "Koulutusohjelmien edellyttämä osaaminen"
            }
          }
        ],
        categories: [
          {
            anchor: "osaaminen-field",
            components: [
              {
                anchor: "A",
                name: "TextBox",
                properties: {
                  placeholder: "Kerro osaamisesta?"
                }
              }
            ]
          }
        ]
      },
      {
        anchor: `${code}-5`,
        components: [
          {
            anchor: "johtaja-label",
            name: "StatusTextRow",
            properties: {
              code: 5,
              labelStyles: {},
              title: "Opetuksesta vastaavan johtajan kelpoisuus ja työkokemus"
            }
          }
        ],
        categories: [
          {
            anchor: `johtaja-info`,
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                properties: {
                  code: "!",
                  labelStyles: {},
                  title:
                    "Valtioneuvoston asetus 434/2018 10 § Selvitys opetuksesta vastaavan johtajan/johtajien kelpoisuudesta ja työkokemuksesta toimipisteittäin."
                }
              }
            ]
          },
          {
            anchor: "johtaja-field",
            components: [
              {
                anchor: "A",
                name: "TextBox",
                properties: {
                  placeholder: "Sana on vapaa..."
                }
              }
            ]
          },
          {
            anchor: "liikenneopettajalupa",
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-liikenneopettajalupa",
                  title: "Liikenneopettajalupa (pakollinen)",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName: "Liikenneopettajalupa"
                  }
                }
              }
            ]
          },
          {
            anchor: "kuorma-autonkuljettaja",
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-kuorma-autonkuljettaja",
                  title:
                    "Voimassa oleva kuorma-autonkuljettajan ammattipätevyys",
                  labelStyles: {},
                  isChecked: false,
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
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-linja-autonkuljettaja",
                  title:
                    "Voimassa oleva linja-autonkuljettajan ammattipätevyys",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName:
                      "Voimassa oleva linja-autonkuljettajan ammattipätevyys
                  }
                }
              }
            ]
          },
          {
            anchor: `paatoiminen-kuljettaja-info`,
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                properties: {
                  code: "a)",
                  labelStyles: {},
                  title:
                    "Vähintään 1 vuoden kokemus johonkin seuraavista luokista kuuluvan ajoneuvonpäätoimisena kuljettajana:"
                }
              }
            ]
          },
          {
            anchor: "C-luokka",
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-c-luokka",
                  title: "C-luokka",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName:
                      "C-luokka"
                  }
                }
              }
            ]
          },
          {
            anchor: "CE-luokka",
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-ce-luokka",
                  title: "CE-luokka",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName:
                      "CE-luokka"
                  }
                }
              }
            ]
          },
          {
            anchor: "D-luokka",
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-d-luokka",
                  title: "D-luokka",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName:
                      "D-luokka"
                  }
                }
              }
            ]
          },
          {
            anchor: `jokin-tutkinnoista`,
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                properties: {
                  code: "b)",
                  labelStyles: {},
                  title: "Jokin seuraavista tutkinnoista:"
                }
              }
            ]
          },
          {
            anchor: "linja-auto-ammattitutkinto",
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-linja-auto-ammattitutkinto",
                  title: "Linja-auton kuljettajan ammattitutkinto",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName:
                      "Linja-auton kuljettajan ammattitutkinto"
                  }
                }
              }
            ]
          },
          {
            anchor: "yhdistelmäajoneuvo-ammattitutkinto",
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-yhdistelmäajoneuvo-ammattitutkinto",
                  title: "Yhdistelmäajoneuvonkuljettajan ammattitutkinto",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName:
                      "Yhdistelmäajoneuvonkuljettajan ammattitutkinto"
                  }
                }
              }
            ]
          },
          {
            anchor: "puutavara-autokuljetus-ammattitutkinto",
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-puutavara-autokuljetus-ammattitutkinto",
                  title: "Puutavaran autonkuljetuksen ammattitutkinto",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName:
                      "Puutavaran autonkuljetuksen ammattitutkinto"
                  }
                }
              }
            ]
          },
          {
            anchor: "kuljetuspalvelut-logistiikan-perustutkinto",
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-kuljetuspalvelut-logistiikan-perustutkinto",
                  title:
                    "Kuljetuspalvelujen koulutusohjelmassa suoritettu logistiikan perustutkinto",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName:
                      "Kuljetuspalvelujen koulutusohjelmassa suoritettu logistiikan perustutkinto"
                  }
                }
              }
            ]
          },
          {
            anchor: "kuljetusalan-ammattitutkinto",
            components: [
              {
                anchor: "A",
                name: "CheckboxWithLabel",
                properties: {
                  name: "checkbox-kuljetusalan-ammattitutkinto",
                  title: "Kuljetusalan ammattitutkinto",
                  labelStyles: {},
                  isChecked: false,
                  forChangeObject: {
                    fieldName:
                      "Kuljetusalan ammattitutkinto"
                  }
                }
              }
            ]
          }
        ]
      },
      {
        anchor: `${code}-6`,
        components: [
          {
            anchor: "opettajien-kelpoisuus-ja-tyokokemus-label",
            name: "StatusTextRow",
            properties: {
              code: 6,
              labelStyles: {},
              title: "Opettajien kelpoisuus ja työkokemus"
            }
          }
        ],
        categories: [
          {
            anchor: `opettajien-kelpoisuus-ja-tyokokemus-info`,
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                properties: {
                  code: "!",
                  labelStyles: {},
                  title:
                    "Valtioneuvoston asetus 434/2018 10 §. Selvitys perustason ammattipätevyyskoulutusen opettajien kelpoisuuksista ja työkokemuksista."
                }
              },
              {
                anchor: `lisaa-henkilo-painike`,
                name: "SimpleButton",
                onClick: handleClickOfAddPeople,
                styleClasses: "flex justify-end",
                properties: {
                  text: "Lisää henkilö"
                }
              }
            ]
          }
        ]
      },
      {
        anchor: `${code}-7`,
        components: [
          {
            anchor: "ajoneuvokanta-label",
            name: "StatusTextRow",
            properties: {
              code: 7,
              labelStyles: {},
              title: "Ajoneuvokanta"
            }
          }
        ],
        categories: [
          {
            anchor: `opettajien-kelpoisuus-ja-tyokokemus-info`,
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                properties: {
                  labelStyles: {},
                  title:
                    "Selvitys opetuksessa käytettävästä ajoneuvokannasta ja opetusvälineistä ja niiden soveltuvuudesta ammattipätevyyskoulutukseen."
                }
              }
            ],
            categories: [
              {
                anchor: `ajoneuvokanta-kentat`,
                components: [
                  {
                    anchor: "A",
                    name: "TextBox",
                    properties: {
                      labelStyles: {},
                      placeholder: "Linja-autojen määrä"
                    }
                  },
                  {
                    anchor: "B",
                    name: "TextBox",
                    properties: {
                      labelStyles: {},
                      placeholder: "Kuorma-autojen määrä"
                    }
                  },
                  {
                    anchor: "C",
                    name: "TextBox",
                    properties: {
                      labelStyles: {},
                      placeholder: "Perävaunujen määrä"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        anchor: `${code}-8`,
        components: [
          {
            anchor: "muut-opetusvalineet-label",
            name: "StatusTextRow",
            properties: {
              code: 8,
              labelStyles: {},
              title: "Muut opetusvälineet"
            }
          }
        ],
        categories: [
          {
            anchor: `ajoneuvokanta-kentat`,
            components: [
              {
                anchor: "A",
                name: "TextBox",
                properties: {
                  labelStyles: {},
                  placeholder:
                    "Asetuksen mukaiset opetus- ja havaintovälineet (VnAsetus 434/2018, 11 § 1 ja 2 mom.)"
                }
              }
            ]
          },
          {
            components: [
              {
                anchor: "muut-opetusvalineet-label",
                name: "StatusTextRow",
                properties: {
                  labelStyles: {},
                  title: "Muut opetus- ja havaintovälineet"
                }
              }
            ]
          },
          {
            components: [
              {
                anchor: "B",
                name: "TextBox",
                properties: {
                  labelStyles: {},
                  placeholder:
                    "Muut oppilaitoksen oppimisympäristöissä tapahtuvaan osaamisen hankkimiseen liittyvät välineet"
                }
              }
            ]
          }
        ]
      }
    ]
  };

  return R.prop(code, forms);
};
