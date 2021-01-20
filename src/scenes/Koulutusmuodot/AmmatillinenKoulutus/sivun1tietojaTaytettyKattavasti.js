export const muutokset = {
  changeObjects: {
    saved: {},
    unsaved: {
      topthree: [
        {
          anchor: "topthree.asianumero.A",
          properties: {
            value: "VN/0000/0002",
            metadata: {
              uuid: undefined
            }
          }
        },
        {
          anchor: "topthree.paatospaiva.A",
          properties: {
            value: new Date(1610979654791),
            metadata: {}
          }
        },
        {
          anchor: "topthree.voimaantulopaiva.A",
          properties: {
            value: new Date(1612102800000),
            metadata: {}
          }
        }
      ],
      tutkinnot: {
        "02": [
          {
            anchor: "tutkinnot_02.1.321501.tutkinto",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "tutkinnot_02.11.324125.tutkinto",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "tutkinnot_02.11.324602.tutkinto",
            properties: {
              isChecked: false,
              isIndeterminate: false
            }
          }
        ],
        "07": [
          {
            anchor: "tutkinnot_07.1.351203.1762.osaamisala",
            properties: {
              isChecked: false,
              isIndeterminate: false
            }
          },
          {
            anchor: "tutkinnot_07.1.351203.tutkinto",
            properties: {
              isChecked: true,
              isIndeterminate: true
            }
          },
          {
            anchor: "tutkinnot_07.12.458641.tutkinto",
            properties: {
              isChecked: false,
              isIndeterminate: false
            }
          },
          {
            anchor: "tutkinnot_07.12.458904.tutkinto",
            properties: {
              isChecked: true
            }
          }
        ]
      },
      koulutukset: {
        valmentavatKoulutukset: [
          {
            anchor: "koulutukset_valmentavatKoulutukset.999903.A",
            properties: {
              metadata: {
                isInLupa: false,
                koodisto: {
                  koodistoUri: "koulutus"
                },
                metadata: {
                  SV: {
                    kieli: "SV",
                    nimi:
                      "Utbildning som handleder för arbete och ett självständigt liv (TELMA)",
                    kuvaus: "",
                    kasite: "",
                    huomioitavaKoodi: "",
                    sisaltaaMerkityksen: "",
                    kayttoohje: ""
                  },
                  FI: {
                    kieli: "FI",
                    nimi:
                      "Työhön ja itsenäiseen elämään valmentava koulutus (TELMA)",
                    kuvaus: "",
                    kasite: "",
                    huomioitavaKoodi: "",
                    sisaltaaMerkityksen: "",
                    kayttoohje: ""
                  }
                },
                maaraysUuid: null
              },
              isChecked: true
            }
          },
          {
            anchor: "koulutukset_valmentavatKoulutukset.999901.A",
            properties: {
              metadata: {
                isInLupa: true,
                koodisto: {
                  koodistoUri: "koulutus"
                },
                metadata: {
                  FI: {
                    kieli: "FI",
                    nimi:
                      "Ammatilliseen koulutukseen valmentava koulutus (VALMA)",
                    kuvaus: "",
                    kasite: "",
                    huomioitavaKoodi: "",
                    sisaltaaMerkityksen: "",
                    kayttoohje: ""
                  },
                  SV: {
                    kieli: "SV",
                    nimi: "Utbildning som handleder för yrkesutbildning",
                    kuvaus: "Utbildning som handleder för yrkesutbildning",
                    kasite: "",
                    huomioitavaKoodi: "",
                    sisaltaaMerkityksen: "",
                    kayttoohje: ""
                  }
                },
                maaraysUuid: "08f7e02a-afc2-11ea-a6cb-005056aa03c8"
              },
              isChecked: false,
              isIndeterminate: false
            }
          }
        ],
        atvKoulutukset: [
          {
            anchor: "koulutukset_atvKoulutukset.2.A",
            properties: {
              metadata: {
                isInLupa: false,
                koodisto: {
                  koodistoUri: "ammatilliseentehtavaanvalmistavakoulutus"
                },
                metadata: {
                  SV: {
                    kieli: "SV",
                    nimi: "Flygledare",
                    kuvaus:
                      "Utbildning som förbereder för uppgiften som flygledare",
                    kasite: "",
                    huomioitavaKoodi: "2",
                    sisaltaaMerkityksen: "",
                    kayttoohje: ""
                  },
                  FI: {
                    kieli: "FI",
                    nimi: "Lennonjohtaja",
                    kuvaus: "Lennonjohtajan tehtäviin valmistava koulutus",
                    kasite: "",
                    huomioitavaKoodi: "2",
                    sisaltaaMerkityksen: "",
                    kayttoohje: ""
                  }
                },
                maaraysUuid: null
              },
              isChecked: true
            }
          }
        ],
        tyovoimakoulutukset: [
          {
            anchor: "koulutukset_tyovoimakoulutukset.3.A",
            properties: {
              metadata: {
                isReasoningRequired: true,
                isInLupa: false,
                koodisto: {
                  koodistoUri: "oivatyovoimakoulutus"
                },
                metadata: {
                  SV: {
                    kieli: "SV",
                    nimi: "Endast arbetskraftspolitisk utbildning",
                    kuvaus:
                      "Utbildningsanordnaren har rätt att ordna ovannämnda examina och utbildningar endast som arbetskraftspolitisk utbildning.",
                    kasite: "",
                    huomioitavaKoodi: "2",
                    sisaltaaMerkityksen: "tyovoima",
                    kayttoohje: ""
                  },
                  FI: {
                    kieli: "FI",
                    nimi: "Vain työvoimakoulutus",
                    kuvaus:
                      "Koulutuksen järjestäjällä on oikeus järjestää em. tutkintoja ja koulutusta vain työvoimakoulutuksena.",
                    kasite: "",
                    huomioitavaKoodi: "2",
                    sisaltaaMerkityksen: "tyovoima",
                    kayttoohje: ""
                  }
                },
                maaraysUuid: null
              },
              isChecked: true
            }
          },
          {
            anchor: "koulutukset_tyovoimakoulutukset.1.A",
            properties: {
              metadata: {
                isReasoningRequired: true,
                isInLupa: true,
                koodisto: {
                  koodistoUri: "oivatyovoimakoulutus"
                },
                metadata: {
                  SV: {
                    kieli: "SV",
                    nimi: "Arbetskraftspolitisk utbildning",
                    kuvaus:
                      "Utbildningsanordnaren har rätt att ordna ovannämnda examina och utbildningar även som arbetskraftspolitisk utbildning.",
                    kasite: "",
                    huomioitavaKoodi: "1",
                    sisaltaaMerkityksen: "tyovoima",
                    kayttoohje: ""
                  },
                  FI: {
                    kieli: "FI",
                    nimi: "Työvoimakoulutus",
                    kuvaus:
                      "Koulutuksen järjestäjällä on oikeus järjestäjää em. tutkintoja ja koulutusta myös työvoimakoulutuksena.",
                    kasite: "",
                    huomioitavaKoodi: "1",
                    sisaltaaMerkityksen: "tyovoima",
                    kayttoohje: ""
                  }
                },
                maaraysUuid: "08f7cb9e-afc2-11ea-a6cb-005056aa03c8"
              },
              isChecked: false
            }
          }
        ],
        kuljettajakoulutukset: [
          {
            anchor: "koulutukset_kuljettajakoulutukset.2.A",
            properties: {
              metadata: {
                isReasoningRequired: true,
                isInLupa: false,
                koodisto: {
                  koodistoUri: "kuljettajakoulutus"
                },
                metadata: {
                  SV: {
                    kieli: "SV",
                    nimi: "Förarutbildning, fortbildning",
                    kuvaus:
                      "Utbildningsanordnaren har med stöd av 23 § 2 mom. i lagen om yrkesutbildning (531/2017) rätt att vara ett utbildningscentrum som ger yrkeskompetens fortbildning för lastbils- och bussförare. Utbildningsanordnaren ska ha ett gällande utbildningsprogram som används i fortbildningen och godkänts av Transport- och kommunikationsverket (Traficom).",
                    kasite: "",
                    huomioitavaKoodi: "2",
                    sisaltaaMerkityksen: "jatko",
                    kayttoohje: ""
                  },
                  FI: {
                    kieli: "FI",
                    nimi: "Kuljettajakoulutus, jatkokoulutus",
                    kuvaus:
                      "Koulutuksen järjestäjällä on oikeus ammatillisesta koulutuksesta annetun lain (531/2017) 23 §:n 2 momentin nojalla toimia kuorma- ja linja-auton kuljettajan ammattipätevyyden jatkokoulutusta antavana koulutuskeskuksena. Koulutuksen järjestäjällä tulee olla voimassa oleva Liikenne- ja viestintäviraston (Traficom) hyväksymä jatkokoulutuksessa käytettävä koulutusohjelma.",
                    kasite: "",
                    huomioitavaKoodi: "2",
                    sisaltaaMerkityksen: "jatko",
                    kayttoohje: ""
                  }
                },
                maaraysUuid: null
              },
              isChecked: true
            }
          },
          {
            anchor: "koulutukset_kuljettajakoulutukset.1.A",
            properties: {
              metadata: {
                isReasoningRequired: true,
                isInLupa: true,
                koodisto: {
                  koodistoUri: "kuljettajakoulutus"
                },
                metadata: {
                  SV: {
                    kieli: "SV",
                    nimi:
                      "Förarutbildning, utbildning för grundläggande yrkeskompetens",
                    kuvaus:
                      "Utbildningsanordnaren har med stöd av 23 § 2 mom. i lagen om yrkesutbildning (531/2017) rätt att vara ett utbildningscentrum som ger utbildning för grundläggande yrkeskompetens för lastbils- och bussförare. Utbildningsanordnaren får ge även fortbildning, om anordnaren för fortbildningen har ett giltigt utbildningsprogram som godkänts av Transport- och kommunikationsverket (Traficom).",
                    kasite: "",
                    huomioitavaKoodi: "1",
                    sisaltaaMerkityksen: "perus",
                    kayttoohje: ""
                  },
                  FI: {
                    kieli: "FI",
                    nimi:
                      "Kuljettajakoulutus, perustason ammattipätevyyskoulutus ja jatkokoulutus",
                    kuvaus:
                      "Koulutuksen järjestäjällä on oikeus ammatillisesta koulutuksesta annetun lain (531/2017) 23 §:n 2 momentin nojalla toimia kuorma- ja linja-auton kuljettajan perustason ammattipätevyyskoulutusta antavana koulutuskeskuksena. Koulutuksen järjestäjä saa antaa myös jatkokoulutusta, jos koulutuksen järjestäjällä on voimassa oleva Liikenne- ja viestintäviraston (Traficom) hyväksymä jatkokoulutuksessa käytettävä koulutusohjelma.",
                    kasite: "",
                    huomioitavaKoodi: "1",
                    sisaltaaMerkityksen: "perus",
                    kayttoohje: ""
                  }
                },
                maaraysUuid: "08f7cc8e-afc2-11ea-a6cb-005056aa03c8"
              },
              isChecked: false
            }
          }
        ]
      },
      kielet: {
        opetuskielet: [
          {
            anchor: "kielet_opetuskielet.2.A",
            properties: {
              metadata: {
                isInLupa: false,
                kuvaus: "ruotsi"
              },
              isChecked: true
            }
          },
          {
            anchor: "kielet_opetuskielet.1.A",
            properties: {
              metadata: {
                isInLupa: true,
                kuvaus: "suomi"
              },
              isChecked: false,
              isIndeterminate: false
            }
          },
          {
            anchor: "kielet_opetuskielet.5.A",
            properties: {
              metadata: {
                isInLupa: false,
                kuvaus: "saame"
              },
              isChecked: true
            }
          }
        ],
        tutkintokielet: {
          "01": [
            {
              anchor: "kielet_tutkintokielet_01.12.417101.kielet",
              properties: {
                value: [
                  {
                    label: "ruotsi",
                    value: "SV"
                  },
                  {
                    label: "fääri",
                    value: "FO"
                  }
                ]
              }
            }
          ],
          "07": [
            {
              anchor: "kielet_tutkintokielet_07.1.351107.kielet",
              properties: {
                value: [
                  {
                    label: "espanja",
                    value: "ES"
                  }
                ]
              }
            },
            {
              anchor: "kielet_tutkintokielet_07.1.351203.kielet",
              properties: {
                value: [
                  {
                    label: "bihari",
                    value: "BH"
                  },
                  {
                    label: "indonesia",
                    value: "ID"
                  }
                ]
              }
            }
          ]
        }
      },
      toimintaalue: [
        {
          anchor: "categoryFilter",
          properties: {
            changesByProvince: {
              "FI-10": [
                {
                  anchor: "areaofaction.FI-10.kunnat.047",
                  properties: {
                    metadata: {
                      koodiarvo: "047",
                      title: "Enontekiö",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.148",
                  properties: {
                    metadata: {
                      koodiarvo: "148",
                      title: "Inari",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.240",
                  properties: {
                    metadata: {
                      koodiarvo: "240",
                      title: "Kemi",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.320",
                  properties: {
                    metadata: {
                      koodiarvo: "320",
                      title: "Kemijärvi",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.241",
                  properties: {
                    metadata: {
                      koodiarvo: "241",
                      title: "Keminmaa",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.261",
                  properties: {
                    metadata: {
                      koodiarvo: "261",
                      title: "Kittilä",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.273",
                  properties: {
                    metadata: {
                      koodiarvo: "273",
                      title: "Kolari",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.498",
                  properties: {
                    metadata: {
                      koodiarvo: "498",
                      title: "Muonio",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.583",
                  properties: {
                    metadata: {
                      koodiarvo: "583",
                      title: "Pelkosenniemi",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.854",
                  properties: {
                    metadata: {
                      koodiarvo: "854",
                      title: "Pello",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.614",
                  properties: {
                    metadata: {
                      koodiarvo: "614",
                      title: "Posio",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.683",
                  properties: {
                    metadata: {
                      koodiarvo: "683",
                      title: "Ranua",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.698",
                  properties: {
                    metadata: {
                      koodiarvo: "698",
                      title: "Rovaniemi",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.732",
                  properties: {
                    metadata: {
                      koodiarvo: "732",
                      title: "Salla",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.742",
                  properties: {
                    metadata: {
                      koodiarvo: "742",
                      title: "Savukoski",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.751",
                  properties: {
                    metadata: {
                      koodiarvo: "751",
                      title: "Simo",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.758",
                  properties: {
                    metadata: {
                      koodiarvo: "758",
                      title: "Sodankylä",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.845",
                  properties: {
                    metadata: {
                      koodiarvo: "845",
                      title: "Tervola",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.851",
                  properties: {
                    metadata: {
                      koodiarvo: "851",
                      title: "Tornio",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.890",
                  properties: {
                    metadata: {
                      koodiarvo: "890",
                      title: "Utsjoki",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.976",
                  properties: {
                    metadata: {
                      koodiarvo: "976",
                      title: "Ylitornio",
                      maakuntaKey: "FI-10",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.A",
                  properties: {
                    metadata: {
                      koodiarvo: "19",
                      maakuntaKey: "FI-10",
                      title: undefined,
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true
                  }
                }
              ],
              "FI-13": [
                {
                  anchor: "areaofaction.FI-13.kunnat.541",
                  properties: {
                    metadata: {
                      koodiarvo: "541",
                      title: "Nurmes",
                      maakuntaKey: "FI-13",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true,
                    isIndeterminate: undefined
                  }
                },
                {
                  anchor: "areaofaction.FI-13.A",
                  properties: {
                    isChecked: true,
                    isIndeterminate: true,
                    metadata: {
                      koodiarvo: "12",
                      maakuntaKey: "FI-13",
                      title: undefined,
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    }
                  }
                },
                {
                  anchor: "areaofaction.FI-13.kunnat.260",
                  properties: {
                    metadata: {
                      koodiarvo: "260",
                      title: "Kitee",
                      maakuntaKey: "FI-13",
                      maaraysUuid: "08f8168a-afc2-11ea-a6cb-005056aa03c8"
                    },
                    isChecked: true,
                    isIndeterminate: undefined
                  }
                }
              ]
            },
            quickFilterChanges: []
          }
        }
      ],
      opiskelijavuodet: [
        {
          anchor: "opiskelijavuodet.vahimmaisopiskelijavuodet.A",
          properties: {
            isValueSet: true,
            applyForValue: 2353,
            isValid: true,
            metadata: {
              koodiarvo: "3",
              maaraysUuid: "08f7cedc-afc2-11ea-a6cb-005056aa03c8"
            }
          }
        },
        {
          anchor: "opiskelijavuodet.vaativatuki.A",
          properties: {
            isValueSet: true,
            applyForValue: 355,
            isValid: true,
            metadata: {}
          }
        },
        {
          anchor: "opiskelijavuodet.sisaoppilaitos.A",
          properties: {
            isValueSet: true,
            applyForValue: 5154,
            isValid: true,
            metadata: {
              koodiarvo: "4"
            }
          }
        }
      ],
      muut: {
        "01": [
          {
            anchor: "muut_01.laajennettuOppisopimuskoulutus.1.A",
            properties: {
              metadata: {
                koodiarvo: "1",
                koodisto: {
                  koodistoUri: "oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                },
                maaraysUuid: "08f7cf40-afc2-11ea-a6cb-005056aa03c8"
              },
              isChecked: false,
              isIndeterminate: false
            }
          }
        ],
        "03": [
          {
            anchor: "muut_03.sisaoppilaitos.4.A",
            properties: {
              metadata: {
                koodiarvo: "4",
                koodisto: {
                  koodistoUri: "oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                }
              },
              isChecked: true
            }
          }
        ],
        "02": [
          {
            anchor: "muut_02.vaativatuki.16.A",
            properties: {
              metadata: {
                koodiarvo: "16",
                koodisto: {
                  koodistoUri: "oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                }
              },
              isChecked: true
            }
          }
        ],
        "06": [
          {
            anchor: "muut_06.yhteistyo.11.A",
            properties: {
              metadata: {
                koodiarvo: "11",
                koodisto: {
                  koodistoUri: "oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                }
              },
              isChecked: true
            }
          }
        ],
        "09": [
          {
            anchor: "muut_09.selvitykset.9.A",
            properties: {
              metadata: {
                koodiarvo: "9",
                koodisto: {
                  koodistoUri: "oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                }
              },
              isChecked: true
            }
          }
        ],
        "04": [
          {
            anchor: "muut_04.vankila.13.A",
            properties: {
              metadata: {
                koodiarvo: "13",
                koodisto: {
                  koodistoUri: "oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                },
                maaraysUuid: "08f7cfa4-afc2-11ea-a6cb-005056aa03c8"
              },
              isChecked: false,
              isIndeterminate: false
            }
          }
        ],
        "05": [
          {
            anchor: "muut_05.urheilu.6.A",
            properties: {
              metadata: {
                koodiarvo: "6",
                koodisto: {
                  koodistoUri: "oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                },
                maaraysUuid: "08f7d06c-afc2-11ea-a6cb-005056aa03c8"
              },
              isChecked: false,
              isIndeterminate: false
            }
          }
        ],
        "08": [
          {
            anchor: "muut_08.yhteistyosopimus.8.A",
            properties: {
              metadata: {
                koodiarvo: "8",
                koodisto: {
                  koodistoUri: "oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                }
              },
              isChecked: true
            }
          },
          {
            anchor: "muut_08.yhteistyosopimus.8.tekstikentta.A",
            properties: {
              value: "Yhteistyön kuvaus",
              metadata: {
                koodiarvo: "8",
                koodisto: {
                  koodistoUri: "oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                }
              }
            }
          }
        ]
      },
      taloudelliset: {
        yleisettiedot: [
          {
            anchor: "taloudelliset_yleisettiedot.edellytykset-tekstikentta.A",
            properties: {
              value: "a"
            }
          },
          {
            anchor: "taloudelliset_yleisettiedot.vaikutukset-tekstikentta.A",
            properties: {
              value: "b"
            }
          },
          {
            anchor: "taloudelliset_yleisettiedot.sopeuttaminen-tekstikentta.A",
            properties: {
              value: "c"
            }
          }
        ],
        investoinnit: [
          {
            anchor: "taloudelliset_investoinnit.investoinnit-tekstikentta.A",
            properties: {
              value: "d"
            }
          },
          {
            anchor: "taloudelliset_investoinnit.kustannukset-Input.A",
            properties: {
              value: 12424
            }
          },
          {
            anchor: "taloudelliset_investoinnit.rahoitus-tekstikentta.A",
            properties: {
              value: "e"
            }
          }
        ],
        tilinpaatostiedot: [
          {
            anchor:
              "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.omavaraisuusaste",
            properties: {
              value: 124
            }
          },
          {
            anchor:
              "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.maksuvalmius",
            properties: {
              value: 34666
            }
          },
          {
            anchor:
              "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.velkaantuneisuus",
            properties: {
              value: 34534
            }
          },
          {
            anchor:
              "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.kannattavuus",
            properties: {
              value: 236
            }
          },
          {
            anchor: "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.jaama",
            properties: {
              value: 324666
            }
          }
        ]
      }
    },
    underRemoval: {}
  },
  focusOn: null,
  latestChanges: {
    underRemoval: [],
    unsaved: [
      {
        anchor:
          "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.omavaraisuusaste",
        properties: {
          value: 124
        }
      },
      {
        anchor:
          "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.maksuvalmius",
        properties: {
          value: 34666
        }
      },
      {
        anchor:
          "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.velkaantuneisuus",
        properties: {
          value: 34534
        }
      },
      {
        anchor:
          "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.kannattavuus",
        properties: {
          value: 236
        }
      },
      {
        anchor: "taloudelliset_tilinpaatostiedot.tilinpaatostiedot.jaama",
        properties: {
          value: 324666
        }
      }
    ]
  },
  validity: {}
};
