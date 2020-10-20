export default {
  changes: {
    "FI-10": [
      {
        anchor: "maakuntakunnat.FI-10.kunnat.583",
        properties: {
          metadata: {
            koodiarvo: "583",
            title: "Pelkosenniemi",
            maakuntaKey: "FI-10"
          },
          isChecked: true
        }
      },
      {
        anchor: "maakuntakunnat.FI-10.A",
        properties: {
          isChecked: true,
          isIndeterminate: true,
          metadata: { koodiarvo: "19", maakuntaKey: "FI-10", title: "Lappi" }
        }
      },
      {
        anchor: "maakuntakunnat.FI-10.kunnat.698",
        properties: {
          metadata: {
            koodiarvo: "698",
            title: "Rovaniemi",
            maakuntaKey: "FI-10"
          },
          isChecked: true
        }
      },
      {
        anchor: "maakuntakunnat.FI-10.kunnat.851",
        properties: {
          metadata: { koodiarvo: "851", title: "Tornio", maakuntaKey: "FI-10" },
          isChecked: true
        }
      },
      {
        anchor: "maakuntakunnat.FI-10.kunnat.976",
        properties: {
          metadata: {
            koodiarvo: "976",
            title: "Ylitornio",
            maakuntaKey: "FI-10"
          },
          isChecked: true
        }
      }
    ],
    "FI-04": [
      {
        anchor: "maakuntakunnat.FI-04.kunnat.588",
        properties: {
          metadata: {
            koodiarvo: "588",
            title: "Pertunmaa",
            maakuntaKey: "FI-04"
          },
          isChecked: true
        }
      },
      {
        anchor: "maakuntakunnat.FI-04.A",
        properties: {
          isChecked: true,
          isIndeterminate: true,
          metadata: {
            koodiarvo: "10",
            maakuntaKey: "FI-04",
            title: "Etelä-Savo"
          }
        }
      },
      {
        anchor: "maakuntakunnat.FI-04.kunnat.618",
        properties: {
          metadata: {
            koodiarvo: "618",
            title: "Punkaharju",
            maakuntaKey: "FI-04"
          },
          isChecked: true
        }
      },
      {
        anchor: "maakuntakunnat.FI-04.kunnat.740",
        properties: {
          metadata: {
            koodiarvo: "740",
            title: "Savonlinna",
            maakuntaKey: "FI-04"
          },
          isChecked: true
        }
      },
      {
        anchor: "maakuntakunnat.FI-04.kunnat.681",
        properties: {
          metadata: {
            koodiarvo: "681",
            title: "Rantasalmi",
            maakuntaKey: "FI-04"
          },
          isChecked: true
        }
      }
    ]
  },

  categories: [
    {
      anchor: "FI-02",
      formId: "FI-02",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "09",
            forChangeObject: {
              koodiarvo: "09",
              maakuntaKey: "FI-02",
              title: "Etelä-Karjala"
            },
            isChecked: true,
            isIndeterminate: true,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "09",
            title: "Etelä-Karjala"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-02",
          components: [
            {
              anchor: "153",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "153",
                forChangeObject: {
                  koodiarvo: "153",
                  title: "Imatra",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "153",
                title: "Imatra"
              }
            },
            {
              anchor: "173",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "173",
                forChangeObject: {
                  koodiarvo: "173",
                  title: "Joutseno",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "173",
                title: "Joutseno"
              }
            },
            {
              anchor: "405",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "405",
                forChangeObject: {
                  koodiarvo: "405",
                  title: "Lappeenranta",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "405",
                title: "Lappeenranta"
              }
            },
            {
              anchor: "416",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "416",
                forChangeObject: {
                  koodiarvo: "416",
                  title: "Lemi",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "416",
                title: "Lemi"
              }
            },
            {
              anchor: "441",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "441",
                forChangeObject: {
                  koodiarvo: "441",
                  title: "Luumäki",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "441",
                title: "Luumäki"
              }
            },
            {
              anchor: "580",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "580",
                forChangeObject: {
                  koodiarvo: "580",
                  title: "Parikkala",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "580",
                title: "Parikkala"
              }
            },
            {
              anchor: "689",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "689",
                forChangeObject: {
                  koodiarvo: "689",
                  title: "Rautjärvi",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "689",
                title: "Rautjärvi"
              }
            },
            {
              anchor: "700",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "700",
                forChangeObject: {
                  koodiarvo: "700",
                  title: "Ruokolahti",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "700",
                title: "Ruokolahti"
              }
            },
            {
              anchor: "728",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "728",
                forChangeObject: {
                  koodiarvo: "728",
                  title: "Saari",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "728",
                title: "Saari"
              }
            },
            {
              anchor: "739",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "739",
                forChangeObject: {
                  koodiarvo: "739",
                  title: "Savitaipale",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "739",
                title: "Savitaipale"
              }
            },
            {
              anchor: "775",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "775",
                forChangeObject: {
                  koodiarvo: "775",
                  title: "Suomenniemi",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "775",
                title: "Suomenniemi"
              }
            },
            {
              anchor: "831",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "831",
                forChangeObject: {
                  koodiarvo: "831",
                  title: "Taipalsaari",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "831",
                title: "Taipalsaari"
              }
            },
            {
              anchor: "891",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "891",
                forChangeObject: {
                  koodiarvo: "891",
                  title: "Uukuniemi",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "891",
                title: "Uukuniemi"
              }
            },
            {
              anchor: "978",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "978",
                forChangeObject: {
                  koodiarvo: "978",
                  title: "Ylämaa",
                  maakuntaKey: "FI-02"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "978",
                title: "Ylämaa"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-03",
      formId: "FI-03",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "14",
            forChangeObject: {
              koodiarvo: "14",
              maakuntaKey: "FI-03",
              title: "Etelä-Pohjanmaa"
            },
            isChecked: true,
            isIndeterminate: true,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "14",
            title: "Etelä-Pohjanmaa"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-03",
          components: [
            {
              anchor: "004",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "004",
                forChangeObject: {
                  koodiarvo: "004",
                  title: "Alahärmä",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "004",
                title: "Alahärmä"
              }
            },
            {
              anchor: "005",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "005",
                forChangeObject: {
                  koodiarvo: "005",
                  title: "Alajärvi",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "005",
                title: "Alajärvi"
              }
            },
            {
              anchor: "010",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "010",
                forChangeObject: {
                  koodiarvo: "010",
                  title: "Alavus",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "010",
                title: "Alavus"
              }
            },
            {
              anchor: "052",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "052",
                forChangeObject: {
                  koodiarvo: "052",
                  title: "Evijärvi",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "052",
                title: "Evijärvi"
              }
            },
            {
              anchor: "145",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "145",
                forChangeObject: {
                  koodiarvo: "145",
                  title: "Ilmajoki",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "145",
                title: "Ilmajoki"
              }
            },
            {
              anchor: "151",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "151",
                forChangeObject: {
                  koodiarvo: "151",
                  title: "Isojoki",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "151",
                title: "Isojoki"
              }
            },
            {
              anchor: "164",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "164",
                forChangeObject: {
                  koodiarvo: "164",
                  title: "Jalasjärvi",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "164",
                title: "Jalasjärvi"
              }
            },
            {
              anchor: "175",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "175",
                forChangeObject: {
                  koodiarvo: "175",
                  title: "Jurva",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "175",
                title: "Jurva"
              }
            },
            {
              anchor: "218",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "218",
                forChangeObject: {
                  koodiarvo: "218",
                  title: "Karijoki",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "218",
                title: "Karijoki"
              }
            },
            {
              anchor: "232",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "232",
                forChangeObject: {
                  koodiarvo: "232",
                  title: "Kauhajoki",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "232",
                title: "Kauhajoki"
              }
            },
            {
              anchor: "233",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "233",
                forChangeObject: {
                  koodiarvo: "233",
                  title: "Kauhava",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "233",
                title: "Kauhava"
              }
            },
            {
              anchor: "281",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "281",
                forChangeObject: {
                  koodiarvo: "281",
                  title: "Kortesjärvi",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "281",
                title: "Kortesjärvi"
              }
            },
            {
              anchor: "300",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "300",
                forChangeObject: {
                  koodiarvo: "300",
                  title: "Kuortane",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "300",
                title: "Kuortane"
              }
            },
            {
              anchor: "301",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "301",
                forChangeObject: {
                  koodiarvo: "301",
                  title: "Kurikka",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "301",
                title: "Kurikka"
              }
            },
            {
              anchor: "403",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "403",
                forChangeObject: {
                  koodiarvo: "403",
                  title: "Lappajärvi",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "403",
                title: "Lappajärvi"
              }
            },
            {
              anchor: "408",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "408",
                forChangeObject: {
                  koodiarvo: "408",
                  title: "Lapua",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "408",
                title: "Lapua"
              }
            },
            {
              anchor: "414",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "414",
                forChangeObject: {
                  koodiarvo: "414",
                  title: "Lehtimäki",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "414",
                title: "Lehtimäki"
              }
            },
            {
              anchor: "544",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "544",
                forChangeObject: {
                  koodiarvo: "544",
                  title: "Nurmo",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "544",
                title: "Nurmo"
              }
            },
            {
              anchor: "589",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "589",
                forChangeObject: {
                  koodiarvo: "589",
                  title: "Peräseinäjoki",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "589",
                title: "Peräseinäjoki"
              }
            },
            {
              anchor: "743",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "743",
                forChangeObject: {
                  koodiarvo: "743",
                  title: "Seinäjoki",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "743",
                title: "Seinäjoki"
              }
            },
            {
              anchor: "759",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "759",
                forChangeObject: {
                  koodiarvo: "759",
                  title: "Soini",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "759",
                title: "Soini"
              }
            },
            {
              anchor: "846",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "846",
                forChangeObject: {
                  koodiarvo: "846",
                  title: "Teuva",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "846",
                title: "Teuva"
              }
            },
            {
              anchor: "863",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "863",
                forChangeObject: {
                  koodiarvo: "863",
                  title: "Töysä",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "863",
                title: "Töysä"
              }
            },
            {
              anchor: "934",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "934",
                forChangeObject: {
                  koodiarvo: "934",
                  title: "Vimpeli",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "934",
                title: "Vimpeli"
              }
            },
            {
              anchor: "971",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "971",
                forChangeObject: {
                  koodiarvo: "971",
                  title: "Ylihärmä",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "971",
                title: "Ylihärmä"
              }
            },
            {
              anchor: "975",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "975",
                forChangeObject: {
                  koodiarvo: "975",
                  title: "Ylistaro",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "975",
                title: "Ylistaro"
              }
            },
            {
              anchor: "989",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "989",
                forChangeObject: {
                  koodiarvo: "989",
                  title: "Ähtäri",
                  maakuntaKey: "FI-03"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "989",
                title: "Ähtäri"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-04",
      formId: "FI-04",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "10",
            forChangeObject: {
              koodiarvo: "10",
              maakuntaKey: "FI-04",
              title: "Etelä-Savo"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "10",
            title: "Etelä-Savo"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-04",
          components: [
            {
              anchor: "014",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "014",
                forChangeObject: {
                  koodiarvo: "014",
                  title: "Anttola",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "014",
                title: "Anttola"
              }
            },
            {
              anchor: "046",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "046",
                forChangeObject: {
                  koodiarvo: "046",
                  title: "Enonkoski",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "046",
                title: "Enonkoski"
              }
            },
            {
              anchor: "085",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "085",
                forChangeObject: {
                  koodiarvo: "085",
                  title: "Haukivuori",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "085",
                title: "Haukivuori"
              }
            },
            {
              anchor: "090",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "090",
                forChangeObject: {
                  koodiarvo: "090",
                  title: "Heinävesi",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "090",
                title: "Heinävesi"
              }
            },
            {
              anchor: "097",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "097",
                forChangeObject: {
                  koodiarvo: "097",
                  title: "Hirvensalmi",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "097",
                title: "Hirvensalmi"
              }
            },
            {
              anchor: "171",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "171",
                forChangeObject: {
                  koodiarvo: "171",
                  title: "Joroinen",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "171",
                title: "Joroinen"
              }
            },
            {
              anchor: "178",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "178",
                forChangeObject: {
                  koodiarvo: "178",
                  title: "Juva",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "178",
                title: "Juva"
              }
            },
            {
              anchor: "184",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "184",
                forChangeObject: {
                  koodiarvo: "184",
                  title: "Jäppilä",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "184",
                title: "Jäppilä"
              }
            },
            {
              anchor: "213",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "213",
                forChangeObject: {
                  koodiarvo: "213",
                  title: "Kangasniemi",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "213",
                title: "Kangasniemi"
              }
            },
            {
              anchor: "246",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "246",
                forChangeObject: {
                  koodiarvo: "246",
                  title: "Kerimäki",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "246",
                title: "Kerimäki"
              }
            },
            {
              anchor: "491",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "491",
                forChangeObject: {
                  koodiarvo: "491",
                  title: "Mikkeli",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "491",
                title: "Mikkeli"
              }
            },
            {
              anchor: "492",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "492",
                forChangeObject: {
                  koodiarvo: "492",
                  title: "Mikkeli mlk",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "492",
                title: "Mikkeli mlk"
              }
            },
            {
              anchor: "507",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "507",
                forChangeObject: {
                  koodiarvo: "507",
                  title: "Mäntyharju",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "507",
                title: "Mäntyharju"
              }
            },
            {
              anchor: "588",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "588",
                forChangeObject: {
                  koodiarvo: "588",
                  title: "Pertunmaa",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "588",
                title: "Pertunmaa"
              }
            },
            {
              anchor: "593",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "593",
                forChangeObject: {
                  koodiarvo: "593",
                  title: "Pieksämäki",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "593",
                title: "Pieksämäki"
              }
            },
            {
              anchor: "594",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "594",
                forChangeObject: {
                  koodiarvo: "594",
                  title: "Pieksämäki mlk",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "594",
                title: "Pieksämäki mlk"
              }
            },
            {
              anchor: "640",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "640",
                forChangeObject: {
                  koodiarvo: "640",
                  title: "Pieksänmaa",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "640",
                title: "Pieksänmaa"
              }
            },
            {
              anchor: "618",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "618",
                forChangeObject: {
                  koodiarvo: "618",
                  title: "Punkaharju",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "618",
                title: "Punkaharju"
              }
            },
            {
              anchor: "623",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "623",
                forChangeObject: {
                  koodiarvo: "623",
                  title: "Puumala",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "623",
                title: "Puumala"
              }
            },
            {
              anchor: "681",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "681",
                forChangeObject: {
                  koodiarvo: "681",
                  title: "Rantasalmi",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "681",
                title: "Rantasalmi"
              }
            },
            {
              anchor: "696",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "696",
                forChangeObject: {
                  koodiarvo: "696",
                  title: "Ristiina",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "696",
                title: "Ristiina"
              }
            },
            {
              anchor: "740",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "740",
                forChangeObject: {
                  koodiarvo: "740",
                  title: "Savonlinna",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "740",
                title: "Savonlinna"
              }
            },
            {
              anchor: "741",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "741",
                forChangeObject: {
                  koodiarvo: "741",
                  title: "Savonranta",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "741",
                title: "Savonranta"
              }
            },
            {
              anchor: "768",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "768",
                forChangeObject: {
                  koodiarvo: "768",
                  title: "Sulkava",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "768",
                title: "Sulkava"
              }
            },
            {
              anchor: "937",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "937",
                forChangeObject: {
                  koodiarvo: "937",
                  title: "Virtasalmi",
                  maakuntaKey: "FI-04"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "937",
                title: "Virtasalmi"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-05",
      formId: "FI-05",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "18",
            forChangeObject: {
              koodiarvo: "18",
              maakuntaKey: "FI-05",
              title: "Kainuu"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "18",
            title: "Kainuu"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-05",
          components: [
            {
              anchor: "105",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "105",
                forChangeObject: {
                  koodiarvo: "105",
                  title: "Hyrynsalmi",
                  maakuntaKey: "FI-05"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "105",
                title: "Hyrynsalmi"
              }
            },
            {
              anchor: "205",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "205",
                forChangeObject: {
                  koodiarvo: "205",
                  title: "Kajaani",
                  maakuntaKey: "FI-05"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "205",
                title: "Kajaani"
              }
            },
            {
              anchor: "290",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "290",
                forChangeObject: {
                  koodiarvo: "290",
                  title: "Kuhmo",
                  maakuntaKey: "FI-05"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "290",
                title: "Kuhmo"
              }
            },
            {
              anchor: "578",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "578",
                forChangeObject: {
                  koodiarvo: "578",
                  title: "Paltamo",
                  maakuntaKey: "FI-05"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "578",
                title: "Paltamo"
              }
            },
            {
              anchor: "620",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "620",
                forChangeObject: {
                  koodiarvo: "620",
                  title: "Puolanka",
                  maakuntaKey: "FI-05"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "620",
                title: "Puolanka"
              }
            },
            {
              anchor: "697",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "697",
                forChangeObject: {
                  koodiarvo: "697",
                  title: "Ristijärvi",
                  maakuntaKey: "FI-05"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "697",
                title: "Ristijärvi"
              }
            },
            {
              anchor: "765",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "765",
                forChangeObject: {
                  koodiarvo: "765",
                  title: "Sotkamo",
                  maakuntaKey: "FI-05"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "765",
                title: "Sotkamo"
              }
            },
            {
              anchor: "777",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "777",
                forChangeObject: {
                  koodiarvo: "777",
                  title: "Suomussalmi",
                  maakuntaKey: "FI-05"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "777",
                title: "Suomussalmi"
              }
            },
            {
              anchor: "940",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "940",
                forChangeObject: {
                  koodiarvo: "940",
                  title: "Vuolijoki",
                  maakuntaKey: "FI-05"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "940",
                title: "Vuolijoki"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-06",
      formId: "FI-06",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "05",
            forChangeObject: {
              koodiarvo: "05",
              maakuntaKey: "FI-06",
              title: "Kanta-Häme"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "05",
            title: "Kanta-Häme"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-06",
          components: [
            {
              anchor: "061",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "061",
                forChangeObject: {
                  koodiarvo: "061",
                  title: "Forssa",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "061",
                title: "Forssa"
              }
            },
            {
              anchor: "082",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "082",
                forChangeObject: {
                  koodiarvo: "082",
                  title: "Hattula",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "082",
                title: "Hattula"
              }
            },
            {
              anchor: "083",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "083",
                forChangeObject: {
                  koodiarvo: "083",
                  title: "Hauho",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "083",
                title: "Hauho"
              }
            },
            {
              anchor: "086",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "086",
                forChangeObject: {
                  koodiarvo: "086",
                  title: "Hausjärvi",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "086",
                title: "Hausjärvi"
              }
            },
            {
              anchor: "103",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "103",
                forChangeObject: {
                  koodiarvo: "103",
                  title: "Humppila",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "103",
                title: "Humppila"
              }
            },
            {
              anchor: "109",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "109",
                forChangeObject: {
                  koodiarvo: "109",
                  title: "Hämeenlinna",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "109",
                title: "Hämeenlinna"
              }
            },
            {
              anchor: "165",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "165",
                forChangeObject: {
                  koodiarvo: "165",
                  title: "Janakkala",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "165",
                title: "Janakkala"
              }
            },
            {
              anchor: "169",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "169",
                forChangeObject: {
                  koodiarvo: "169",
                  title: "Jokioinen",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "169",
                title: "Jokioinen"
              }
            },
            {
              anchor: "210",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "210",
                forChangeObject: {
                  koodiarvo: "210",
                  title: "Kalvola",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "210",
                title: "Kalvola"
              }
            },
            {
              anchor: "401",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "401",
                forChangeObject: {
                  koodiarvo: "401",
                  title: "Lammi",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "401",
                title: "Lammi"
              }
            },
            {
              anchor: "433",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "433",
                forChangeObject: {
                  koodiarvo: "433",
                  title: "Loppi",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "433",
                title: "Loppi"
              }
            },
            {
              anchor: "692",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "692",
                forChangeObject: {
                  koodiarvo: "692",
                  title: "Renko",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "692",
                title: "Renko"
              }
            },
            {
              anchor: "694",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "694",
                forChangeObject: {
                  koodiarvo: "694",
                  title: "Riihimäki",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "694",
                title: "Riihimäki"
              }
            },
            {
              anchor: "834",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "834",
                forChangeObject: {
                  koodiarvo: "834",
                  title: "Tammela",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "834",
                title: "Tammela"
              }
            },
            {
              anchor: "855",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "855",
                forChangeObject: {
                  koodiarvo: "855",
                  title: "Tuulos",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "855",
                title: "Tuulos"
              }
            },
            {
              anchor: "981",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "981",
                forChangeObject: {
                  koodiarvo: "981",
                  title: "Ypäjä",
                  maakuntaKey: "FI-06"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "981",
                title: "Ypäjä"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-07",
      formId: "FI-07",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "16",
            forChangeObject: {
              koodiarvo: "16",
              maakuntaKey: "FI-07",
              title: "Keski-Pohjanmaa"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "16",
            title: "Keski-Pohjanmaa"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-07",
          components: [
            {
              anchor: "074",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "074",
                forChangeObject: {
                  koodiarvo: "074",
                  title: "Halsua",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "074",
                title: "Halsua"
              }
            },
            {
              anchor: "217",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "217",
                forChangeObject: {
                  koodiarvo: "217",
                  title: "Kannus",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "217",
                title: "Kannus"
              }
            },
            {
              anchor: "236",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "236",
                forChangeObject: {
                  koodiarvo: "236",
                  title: "Kaustinen",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "236",
                title: "Kaustinen"
              }
            },
            {
              anchor: "272",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "272",
                forChangeObject: {
                  koodiarvo: "272",
                  title: "Kokkola",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "272",
                title: "Kokkola"
              }
            },
            {
              anchor: "315",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "315",
                forChangeObject: {
                  koodiarvo: "315",
                  title: "Kälviä",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "315",
                title: "Kälviä"
              }
            },
            {
              anchor: "421",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "421",
                forChangeObject: {
                  koodiarvo: "421",
                  title: "Lestijärvi",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "421",
                title: "Lestijärvi"
              }
            },
            {
              anchor: "429",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "429",
                forChangeObject: {
                  koodiarvo: "429",
                  title: "Lohtaja",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "429",
                title: "Lohtaja"
              }
            },
            {
              anchor: "584",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "584",
                forChangeObject: {
                  koodiarvo: "584",
                  title: "Perho",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "584",
                title: "Perho"
              }
            },
            {
              anchor: "849",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "849",
                forChangeObject: {
                  koodiarvo: "849",
                  title: "Toholampi",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "849",
                title: "Toholampi"
              }
            },
            {
              anchor: "885",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "885",
                forChangeObject: {
                  koodiarvo: "885",
                  title: "Ullava",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "885",
                title: "Ullava"
              }
            },
            {
              anchor: "924",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "924",
                forChangeObject: {
                  koodiarvo: "924",
                  title: "Veteli",
                  maakuntaKey: "FI-07"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "924",
                title: "Veteli"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-08",
      formId: "FI-08",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "13",
            forChangeObject: {
              koodiarvo: "13",
              maakuntaKey: "FI-08",
              title: "Keski-Suomi"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "13",
            title: "Keski-Suomi"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-08",
          components: [
            {
              anchor: "077",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "077",
                forChangeObject: {
                  koodiarvo: "077",
                  title: "Hankasalmi",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "077",
                title: "Hankasalmi"
              }
            },
            {
              anchor: "172",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "172",
                forChangeObject: {
                  koodiarvo: "172",
                  title: "Joutsa",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "172",
                title: "Joutsa"
              }
            },
            {
              anchor: "179",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "179",
                forChangeObject: {
                  koodiarvo: "179",
                  title: "Jyväskylä",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "179",
                title: "Jyväskylä"
              }
            },
            {
              anchor: "180",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "180",
                forChangeObject: {
                  koodiarvo: "180",
                  title: "Jyväskylä mlk",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "180",
                title: "Jyväskylä mlk"
              }
            },
            {
              anchor: "182",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "182",
                forChangeObject: {
                  koodiarvo: "182",
                  title: "Jämsä",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "182",
                title: "Jämsä"
              }
            },
            {
              anchor: "183",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "183",
                forChangeObject: {
                  koodiarvo: "183",
                  title: "Jämsänkoski",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "183",
                title: "Jämsänkoski"
              }
            },
            {
              anchor: "216",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "216",
                forChangeObject: {
                  koodiarvo: "216",
                  title: "Kannonkoski",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "216",
                title: "Kannonkoski"
              }
            },
            {
              anchor: "226",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "226",
                forChangeObject: {
                  koodiarvo: "226",
                  title: "Karstula",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "226",
                title: "Karstula"
              }
            },
            {
              anchor: "249",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "249",
                forChangeObject: {
                  koodiarvo: "249",
                  title: "Keuruu",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "249",
                title: "Keuruu"
              }
            },
            {
              anchor: "256",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "256",
                forChangeObject: {
                  koodiarvo: "256",
                  title: "Kinnula",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "256",
                title: "Kinnula"
              }
            },
            {
              anchor: "265",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "265",
                forChangeObject: {
                  koodiarvo: "265",
                  title: "Kivijärvi",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "265",
                title: "Kivijärvi"
              }
            },
            {
              anchor: "275",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "275",
                forChangeObject: {
                  koodiarvo: "275",
                  title: "Konnevesi",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "275",
                title: "Konnevesi"
              }
            },
            {
              anchor: "277",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "277",
                forChangeObject: {
                  koodiarvo: "277",
                  title: "Korpilahti",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "277",
                title: "Korpilahti"
              }
            },
            {
              anchor: "291",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "291",
                forChangeObject: {
                  koodiarvo: "291",
                  title: "Kuhmoinen",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "291",
                title: "Kuhmoinen"
              }
            },
            {
              anchor: "312",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "312",
                forChangeObject: {
                  koodiarvo: "312",
                  title: "Kyyjärvi",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "312",
                title: "Kyyjärvi"
              }
            },
            {
              anchor: "410",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "410",
                forChangeObject: {
                  koodiarvo: "410",
                  title: "Laukaa",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "410",
                title: "Laukaa"
              }
            },
            {
              anchor: "415",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "415",
                forChangeObject: {
                  koodiarvo: "415",
                  title: "Leivonmäki",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "415",
                title: "Leivonmäki"
              }
            },
            {
              anchor: "435",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "435",
                forChangeObject: {
                  koodiarvo: "435",
                  title: "Luhanka",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "435",
                title: "Luhanka"
              }
            },
            {
              anchor: "495",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "495",
                forChangeObject: {
                  koodiarvo: "495",
                  title: "Multia",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "495",
                title: "Multia"
              }
            },
            {
              anchor: "500",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "500",
                forChangeObject: {
                  koodiarvo: "500",
                  title: "Muurame",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "500",
                title: "Muurame"
              }
            },
            {
              anchor: "592",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "592",
                forChangeObject: {
                  koodiarvo: "592",
                  title: "Petäjävesi",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "592",
                title: "Petäjävesi"
              }
            },
            {
              anchor: "601",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "601",
                forChangeObject: {
                  koodiarvo: "601",
                  title: "Pihtipudas",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "601",
                title: "Pihtipudas"
              }
            },
            {
              anchor: "633",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "633",
                forChangeObject: {
                  koodiarvo: "633",
                  title: "Pylkönmäki",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "633",
                title: "Pylkönmäki"
              }
            },
            {
              anchor: "729",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "729",
                forChangeObject: {
                  koodiarvo: "729",
                  title: "Saarijärvi",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "729",
                title: "Saarijärvi"
              }
            },
            {
              anchor: "770",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "770",
                forChangeObject: {
                  koodiarvo: "770",
                  title: "Sumiainen",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "770",
                title: "Sumiainen"
              }
            },
            {
              anchor: "774",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "774",
                forChangeObject: {
                  koodiarvo: "774",
                  title: "Suolahti",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "774",
                title: "Suolahti"
              }
            },
            {
              anchor: "850",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "850",
                forChangeObject: {
                  koodiarvo: "850",
                  title: "Toivakka",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "850",
                title: "Toivakka"
              }
            },
            {
              anchor: "892",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "892",
                forChangeObject: {
                  koodiarvo: "892",
                  title: "Uurainen",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "892",
                title: "Uurainen"
              }
            },
            {
              anchor: "931",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "931",
                forChangeObject: {
                  koodiarvo: "931",
                  title: "Viitasaari",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "931",
                title: "Viitasaari"
              }
            },
            {
              anchor: "992",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "992",
                forChangeObject: {
                  koodiarvo: "992",
                  title: "Äänekoski",
                  maakuntaKey: "FI-08"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "992",
                title: "Äänekoski"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-09",
      formId: "FI-09",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "08",
            forChangeObject: {
              koodiarvo: "08",
              maakuntaKey: "FI-09",
              title: "Kymenlaakso"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "08",
            title: "Kymenlaakso"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-09",
          components: [
            {
              anchor: "754",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "754",
                forChangeObject: {
                  koodiarvo: "754",
                  title: "Anjalankoski",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "754",
                title: "Anjalankoski"
              }
            },
            {
              anchor: "044",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "044",
                forChangeObject: {
                  koodiarvo: "044",
                  title: "Elimäki",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "044",
                title: "Elimäki"
              }
            },
            {
              anchor: "075",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "075",
                forChangeObject: {
                  koodiarvo: "075",
                  title: "Hamina",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "075",
                title: "Hamina"
              }
            },
            {
              anchor: "142",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "142",
                forChangeObject: {
                  koodiarvo: "142",
                  title: "Iitti",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "142",
                title: "Iitti"
              }
            },
            {
              anchor: "163",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "163",
                forChangeObject: {
                  koodiarvo: "163",
                  title: "Jaala",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "163",
                title: "Jaala"
              }
            },
            {
              anchor: "285",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "285",
                forChangeObject: {
                  koodiarvo: "285",
                  title: "Kotka",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "285",
                title: "Kotka"
              }
            },
            {
              anchor: "286",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "286",
                forChangeObject: {
                  koodiarvo: "286",
                  title: "Kouvola",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "286",
                title: "Kouvola"
              }
            },
            {
              anchor: "306",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "306",
                forChangeObject: {
                  koodiarvo: "306",
                  title: "Kuusankoski",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "306",
                title: "Kuusankoski"
              }
            },
            {
              anchor: "489",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "489",
                forChangeObject: {
                  koodiarvo: "489",
                  title: "Miehikkälä",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "489",
                title: "Miehikkälä"
              }
            },
            {
              anchor: "624",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "624",
                forChangeObject: {
                  koodiarvo: "624",
                  title: "Pyhtää",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "624",
                title: "Pyhtää"
              }
            },
            {
              anchor: "909",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "909",
                forChangeObject: {
                  koodiarvo: "909",
                  title: "Valkeala",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "909",
                title: "Valkeala"
              }
            },
            {
              anchor: "917",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "917",
                forChangeObject: {
                  koodiarvo: "917",
                  title: "Vehkalahti",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "917",
                title: "Vehkalahti"
              }
            },
            {
              anchor: "935",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "935",
                forChangeObject: {
                  koodiarvo: "935",
                  title: "Virolahti",
                  maakuntaKey: "FI-09"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "935",
                title: "Virolahti"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-10",
      formId: "FI-10",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "19",
            forChangeObject: {
              koodiarvo: "19",
              maakuntaKey: "FI-10",
              title: "Lappi"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "19",
            title: "Lappi"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-10",
          components: [
            {
              anchor: "047",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "047",
                forChangeObject: {
                  koodiarvo: "047",
                  title: "Enontekiö",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "047",
                title: "Enontekiö"
              }
            },
            {
              anchor: "148",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "148",
                forChangeObject: {
                  koodiarvo: "148",
                  title: "Inari",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "148",
                title: "Inari"
              }
            },
            {
              anchor: "240",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "240",
                forChangeObject: {
                  koodiarvo: "240",
                  title: "Kemi",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "240",
                title: "Kemi"
              }
            },
            {
              anchor: "320",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "320",
                forChangeObject: {
                  koodiarvo: "320",
                  title: "Kemijärvi",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "320",
                title: "Kemijärvi"
              }
            },
            {
              anchor: "241",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "241",
                forChangeObject: {
                  koodiarvo: "241",
                  title: "Keminmaa",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "241",
                title: "Keminmaa"
              }
            },
            {
              anchor: "261",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "261",
                forChangeObject: {
                  koodiarvo: "261",
                  title: "Kittilä",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "261",
                title: "Kittilä"
              }
            },
            {
              anchor: "273",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "273",
                forChangeObject: {
                  koodiarvo: "273",
                  title: "Kolari",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "273",
                title: "Kolari"
              }
            },
            {
              anchor: "498",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "498",
                forChangeObject: {
                  koodiarvo: "498",
                  title: "Muonio",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "498",
                title: "Muonio"
              }
            },
            {
              anchor: "583",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "583",
                forChangeObject: {
                  koodiarvo: "583",
                  title: "Pelkosenniemi",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "583",
                title: "Pelkosenniemi"
              }
            },
            {
              anchor: "854",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "854",
                forChangeObject: {
                  koodiarvo: "854",
                  title: "Pello",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "854",
                title: "Pello"
              }
            },
            {
              anchor: "614",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "614",
                forChangeObject: {
                  koodiarvo: "614",
                  title: "Posio",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "614",
                title: "Posio"
              }
            },
            {
              anchor: "683",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "683",
                forChangeObject: {
                  koodiarvo: "683",
                  title: "Ranua",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "683",
                title: "Ranua"
              }
            },
            {
              anchor: "698",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "698",
                forChangeObject: {
                  koodiarvo: "698",
                  title: "Rovaniemi",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "698",
                title: "Rovaniemi"
              }
            },
            {
              anchor: "699",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "699",
                forChangeObject: {
                  koodiarvo: "699",
                  title: "Rovaniemi mlk",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "699",
                title: "Rovaniemi mlk"
              }
            },
            {
              anchor: "732",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "732",
                forChangeObject: {
                  koodiarvo: "732",
                  title: "Salla",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "732",
                title: "Salla"
              }
            },
            {
              anchor: "742",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "742",
                forChangeObject: {
                  koodiarvo: "742",
                  title: "Savukoski",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "742",
                title: "Savukoski"
              }
            },
            {
              anchor: "751",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "751",
                forChangeObject: {
                  koodiarvo: "751",
                  title: "Simo",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "751",
                title: "Simo"
              }
            },
            {
              anchor: "758",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "758",
                forChangeObject: {
                  koodiarvo: "758",
                  title: "Sodankylä",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "758",
                title: "Sodankylä"
              }
            },
            {
              anchor: "845",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "845",
                forChangeObject: {
                  koodiarvo: "845",
                  title: "Tervola",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "845",
                title: "Tervola"
              }
            },
            {
              anchor: "851",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "851",
                forChangeObject: {
                  koodiarvo: "851",
                  title: "Tornio",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "851",
                title: "Tornio"
              }
            },
            {
              anchor: "890",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "890",
                forChangeObject: {
                  koodiarvo: "890",
                  title: "Utsjoki",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "890",
                title: "Utsjoki"
              }
            },
            {
              anchor: "976",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "976",
                forChangeObject: {
                  koodiarvo: "976",
                  title: "Ylitornio",
                  maakuntaKey: "FI-10"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "976",
                title: "Ylitornio"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-11",
      formId: "FI-11",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "06",
            forChangeObject: {
              koodiarvo: "06",
              maakuntaKey: "FI-11",
              title: "Pirkanmaa"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "06",
            title: "Pirkanmaa"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-11",
          components: [
            {
              anchor: "020",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "020",
                forChangeObject: {
                  koodiarvo: "020",
                  title: "Akaa",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "020",
                title: "Akaa"
              }
            },
            {
              anchor: "108",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "108",
                forChangeObject: {
                  koodiarvo: "108",
                  title: "Hämeenkyrö",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "108",
                title: "Hämeenkyrö"
              }
            },
            {
              anchor: "143",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "143",
                forChangeObject: {
                  koodiarvo: "143",
                  title: "Ikaalinen",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "143",
                title: "Ikaalinen"
              }
            },
            {
              anchor: "177",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "177",
                forChangeObject: {
                  koodiarvo: "177",
                  title: "Juupajoki",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "177",
                title: "Juupajoki"
              }
            },
            {
              anchor: "211",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "211",
                forChangeObject: {
                  koodiarvo: "211",
                  title: "Kangasala",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "211",
                title: "Kangasala"
              }
            },
            {
              anchor: "250",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "250",
                forChangeObject: {
                  koodiarvo: "250",
                  title: "Kihniö",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "250",
                title: "Kihniö"
              }
            },
            {
              anchor: "289",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "289",
                forChangeObject: {
                  koodiarvo: "289",
                  title: "Kuhmalahti",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "289",
                title: "Kuhmalahti"
              }
            },
            {
              anchor: "299",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "299",
                forChangeObject: {
                  koodiarvo: "299",
                  title: "Kuorevesi",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "299",
                title: "Kuorevesi"
              }
            },
            {
              anchor: "303",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "303",
                forChangeObject: {
                  koodiarvo: "303",
                  title: "Kuru",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "303",
                title: "Kuru"
              }
            },
            {
              anchor: "310",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "310",
                forChangeObject: {
                  koodiarvo: "310",
                  title: "Kylmäkoski",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "310",
                title: "Kylmäkoski"
              }
            },
            {
              anchor: "418",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "418",
                forChangeObject: {
                  koodiarvo: "418",
                  title: "Lempäälä",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "418",
                title: "Lempäälä"
              }
            },
            {
              anchor: "439",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "439",
                forChangeObject: {
                  koodiarvo: "439",
                  title: "Luopioinen",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "439",
                title: "Luopioinen"
              }
            },
            {
              anchor: "443",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "443",
                forChangeObject: {
                  koodiarvo: "443",
                  title: "Längelmäki",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "443",
                title: "Längelmäki"
              }
            },
            {
              anchor: "493",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "493",
                forChangeObject: {
                  koodiarvo: "493",
                  title: "Mouhijärvi",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "493",
                title: "Mouhijärvi"
              }
            },
            {
              anchor: "506",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "506",
                forChangeObject: {
                  koodiarvo: "506",
                  title: "Mänttä",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "506",
                title: "Mänttä"
              }
            },
            {
              anchor: "508",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "508",
                forChangeObject: {
                  koodiarvo: "508",
                  title: "Mänttä-Vilppula",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "508",
                title: "Mänttä-Vilppula"
              }
            },
            {
              anchor: "536",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "536",
                forChangeObject: {
                  koodiarvo: "536",
                  title: "Nokia",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "536",
                title: "Nokia"
              }
            },
            {
              anchor: "562",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "562",
                forChangeObject: {
                  koodiarvo: "562",
                  title: "Orivesi",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "562",
                title: "Orivesi"
              }
            },
            {
              anchor: "581",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "581",
                forChangeObject: {
                  koodiarvo: "581",
                  title: "Parkano",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "581",
                title: "Parkano"
              }
            },
            {
              anchor: "604",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "604",
                forChangeObject: {
                  koodiarvo: "604",
                  title: "Pirkkala",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "604",
                title: "Pirkkala"
              }
            },
            {
              anchor: "994",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "994",
                forChangeObject: {
                  koodiarvo: "994",
                  title: "Pirkkala",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "994",
                title: "Pirkkala"
              }
            },
            {
              anchor: "619",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "619",
                forChangeObject: {
                  koodiarvo: "619",
                  title: "Punkalaidun",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "619",
                title: "Punkalaidun"
              }
            },
            {
              anchor: "635",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "635",
                forChangeObject: {
                  koodiarvo: "635",
                  title: "Pälkäne",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "635",
                title: "Pälkäne"
              }
            },
            {
              anchor: "702",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "702",
                forChangeObject: {
                  koodiarvo: "702",
                  title: "Ruovesi",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "702",
                title: "Ruovesi"
              }
            },
            {
              anchor: "730",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "730",
                forChangeObject: {
                  koodiarvo: "730",
                  title: "Sahalahti",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "730",
                title: "Sahalahti"
              }
            },
            {
              anchor: "790",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "790",
                forChangeObject: {
                  koodiarvo: "790",
                  title: "Sastamala",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "790",
                title: "Sastamala"
              }
            },
            {
              anchor: "772",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "772",
                forChangeObject: {
                  koodiarvo: "772",
                  title: "Suodenniemi",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "772",
                title: "Suodenniemi"
              }
            },
            {
              anchor: "837",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "837",
                forChangeObject: {
                  koodiarvo: "837",
                  title: "Tampere",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "837",
                title: "Tampere"
              }
            },
            {
              anchor: "864",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "864",
                forChangeObject: {
                  koodiarvo: "864",
                  title: "Toijala",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "864",
                title: "Toijala"
              }
            },
            {
              anchor: "887",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "887",
                forChangeObject: {
                  koodiarvo: "887",
                  title: "Urjala",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "887",
                title: "Urjala"
              }
            },
            {
              anchor: "908",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "908",
                forChangeObject: {
                  koodiarvo: "908",
                  title: "Valkeakoski",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "908",
                title: "Valkeakoski"
              }
            },
            {
              anchor: "912",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "912",
                forChangeObject: {
                  koodiarvo: "912",
                  title: "Vammala",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "912",
                title: "Vammala"
              }
            },
            {
              anchor: "922",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "922",
                forChangeObject: {
                  koodiarvo: "922",
                  title: "Vesilahti",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "922",
                title: "Vesilahti"
              }
            },
            {
              anchor: "928",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "928",
                forChangeObject: {
                  koodiarvo: "928",
                  title: "Viiala",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "928",
                title: "Viiala"
              }
            },
            {
              anchor: "932",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "932",
                forChangeObject: {
                  koodiarvo: "932",
                  title: "Viljakkala",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "932",
                title: "Viljakkala"
              }
            },
            {
              anchor: "933",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "933",
                forChangeObject: {
                  koodiarvo: "933",
                  title: "Vilppula",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "933",
                title: "Vilppula"
              }
            },
            {
              anchor: "936",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "936",
                forChangeObject: {
                  koodiarvo: "936",
                  title: "Virrat",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "936",
                title: "Virrat"
              }
            },
            {
              anchor: "980",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "980",
                forChangeObject: {
                  koodiarvo: "980",
                  title: "Ylöjärvi",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "980",
                title: "Ylöjärvi"
              }
            },
            {
              anchor: "988",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "988",
                forChangeObject: {
                  koodiarvo: "988",
                  title: "Äetsä",
                  maakuntaKey: "FI-11"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "988",
                title: "Äetsä"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-12",
      formId: "FI-12",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "15",
            forChangeObject: {
              koodiarvo: "15",
              maakuntaKey: "FI-12",
              title: "Pohjanmaa"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "15",
            title: "Pohjanmaa"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-12",
          components: [
            {
              anchor: "152",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "152",
                forChangeObject: {
                  koodiarvo: "152",
                  title: "Isokyrö",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "152",
                title: "Isokyrö"
              }
            },
            {
              anchor: "231",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "231",
                forChangeObject: {
                  koodiarvo: "231",
                  title: "Kaskinen",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "231",
                title: "Kaskinen"
              }
            },
            {
              anchor: "280",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "280",
                forChangeObject: {
                  koodiarvo: "280",
                  title: "Korsnäs",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "280",
                title: "Korsnäs"
              }
            },
            {
              anchor: "287",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "287",
                forChangeObject: {
                  koodiarvo: "287",
                  title: "Kristiinankaupunki",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "287",
                title: "Kristiinankaupunki"
              }
            },
            {
              anchor: "288",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "288",
                forChangeObject: {
                  koodiarvo: "288",
                  title: "Kruunupyy",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "288",
                title: "Kruunupyy"
              }
            },
            {
              anchor: "399",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "399",
                forChangeObject: {
                  koodiarvo: "399",
                  title: "Laihia",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "399",
                title: "Laihia"
              }
            },
            {
              anchor: "440",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "440",
                forChangeObject: {
                  koodiarvo: "440",
                  title: "Luoto",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "440",
                title: "Luoto"
              }
            },
            {
              anchor: "475",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "475",
                forChangeObject: {
                  koodiarvo: "475",
                  title: "Maalahti",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "475",
                title: "Maalahti"
              }
            },
            {
              anchor: "479",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "479",
                forChangeObject: {
                  koodiarvo: "479",
                  title: "Maksamaa",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "479",
                title: "Maksamaa"
              }
            },
            {
              anchor: "499",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "499",
                forChangeObject: {
                  koodiarvo: "499",
                  title: "Mustasaari",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "499",
                title: "Mustasaari"
              }
            },
            {
              anchor: "545",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "545",
                forChangeObject: {
                  koodiarvo: "545",
                  title: "Närpiö",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "545",
                title: "Närpiö"
              }
            },
            {
              anchor: "559",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "559",
                forChangeObject: {
                  koodiarvo: "559",
                  title: "Oravainen",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "559",
                title: "Oravainen"
              }
            },
            {
              anchor: "599",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "599",
                forChangeObject: {
                  koodiarvo: "599",
                  title: "Pedersöre",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "599",
                title: "Pedersöre"
              }
            },
            {
              anchor: "598",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "598",
                forChangeObject: {
                  koodiarvo: "598",
                  title: "Pietarsaari",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "598",
                title: "Pietarsaari"
              }
            },
            {
              anchor: "893",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "893",
                forChangeObject: {
                  koodiarvo: "893",
                  title: "Uusikaarlepyy",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "893",
                title: "Uusikaarlepyy"
              }
            },
            {
              anchor: "905",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "905",
                forChangeObject: {
                  koodiarvo: "905",
                  title: "Vaasa",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "905",
                title: "Vaasa"
              }
            },
            {
              anchor: "942",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "942",
                forChangeObject: {
                  koodiarvo: "942",
                  title: "Vähäkyrö",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "942",
                title: "Vähäkyrö"
              }
            },
            {
              anchor: "946",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "946",
                forChangeObject: {
                  koodiarvo: "946",
                  title: "Vöyri",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "946",
                title: "Vöyri"
              }
            },
            {
              anchor: "944",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "944",
                forChangeObject: {
                  koodiarvo: "944",
                  title: "Vöyri",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "944",
                title: "Vöyri"
              }
            },
            {
              anchor: "945",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "945",
                forChangeObject: {
                  koodiarvo: "945",
                  title: "Vöyri-Maksmaa",
                  maakuntaKey: "FI-12"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "945",
                title: "Vöyri-Maksmaa"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-13",
      formId: "FI-13",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "12",
            forChangeObject: {
              koodiarvo: "12",
              maakuntaKey: "FI-13",
              title: "Pohjois-Karjala"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "12",
            title: "Pohjois-Karjala"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-13",
          components: [
            {
              anchor: "045",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "045",
                forChangeObject: {
                  koodiarvo: "045",
                  title: "Eno",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "045",
                title: "Eno"
              }
            },
            {
              anchor: "146",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "146",
                forChangeObject: {
                  koodiarvo: "146",
                  title: "Ilomantsi",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "146",
                title: "Ilomantsi"
              }
            },
            {
              anchor: "167",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "167",
                forChangeObject: {
                  koodiarvo: "167",
                  title: "Joensuu",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "167",
                title: "Joensuu"
              }
            },
            {
              anchor: "176",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "176",
                forChangeObject: {
                  koodiarvo: "176",
                  title: "Juuka",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "176",
                title: "Juuka"
              }
            },
            {
              anchor: "248",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "248",
                forChangeObject: {
                  koodiarvo: "248",
                  title: "Kesälahti",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "248",
                title: "Kesälahti"
              }
            },
            {
              anchor: "251",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "251",
                forChangeObject: {
                  koodiarvo: "251",
                  title: "Kiihtelysvaara",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "251",
                title: "Kiihtelysvaara"
              }
            },
            {
              anchor: "260",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "260",
                forChangeObject: {
                  koodiarvo: "260",
                  title: "Kitee",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "260",
                title: "Kitee"
              }
            },
            {
              anchor: "276",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "276",
                forChangeObject: {
                  koodiarvo: "276",
                  title: "Kontiolahti",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "276",
                title: "Kontiolahti"
              }
            },
            {
              anchor: "422",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "422",
                forChangeObject: {
                  koodiarvo: "422",
                  title: "Lieksa",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "422",
                title: "Lieksa"
              }
            },
            {
              anchor: "426",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "426",
                forChangeObject: {
                  koodiarvo: "426",
                  title: "Liperi",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "426",
                title: "Liperi"
              }
            },
            {
              anchor: "541",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "541",
                forChangeObject: {
                  koodiarvo: "541",
                  title: "Nurmes",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "541",
                title: "Nurmes"
              }
            },
            {
              anchor: "309",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "309",
                forChangeObject: {
                  koodiarvo: "309",
                  title: "Outokumpu",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "309",
                title: "Outokumpu"
              }
            },
            {
              anchor: "607",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "607",
                forChangeObject: {
                  koodiarvo: "607",
                  title: "Polvijärvi",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "607",
                title: "Polvijärvi"
              }
            },
            {
              anchor: "632",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "632",
                forChangeObject: {
                  koodiarvo: "632",
                  title: "Pyhäselkä",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "632",
                title: "Pyhäselkä"
              }
            },
            {
              anchor: "707",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "707",
                forChangeObject: {
                  koodiarvo: "707",
                  title: "Rääkkylä",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "707",
                title: "Rääkkylä"
              }
            },
            {
              anchor: "848",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "848",
                forChangeObject: {
                  koodiarvo: "848",
                  title: "Tohmajärvi",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "848",
                title: "Tohmajärvi"
              }
            },
            {
              anchor: "856",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "856",
                forChangeObject: {
                  koodiarvo: "856",
                  title: "Tuupovaara",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "856",
                title: "Tuupovaara"
              }
            },
            {
              anchor: "911",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "911",
                forChangeObject: {
                  koodiarvo: "911",
                  title: "Valtimo",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "911",
                title: "Valtimo"
              }
            },
            {
              anchor: "943",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "943",
                forChangeObject: {
                  koodiarvo: "943",
                  title: "Värtsilä",
                  maakuntaKey: "FI-13"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "943",
                title: "Värtsilä"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-14",
      formId: "FI-14",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "17",
            forChangeObject: {
              koodiarvo: "17",
              maakuntaKey: "FI-14",
              title: "Pohjois-Pohjanmaa"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "17",
            title: "Pohjois-Pohjanmaa"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-14",
          components: [
            {
              anchor: "009",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "009",
                forChangeObject: {
                  koodiarvo: "009",
                  title: "Alavieska",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "009",
                title: "Alavieska"
              }
            },
            {
              anchor: "069",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "069",
                forChangeObject: {
                  koodiarvo: "069",
                  title: "Haapajärvi",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "069",
                title: "Haapajärvi"
              }
            },
            {
              anchor: "071",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "071",
                forChangeObject: {
                  koodiarvo: "071",
                  title: "Haapavesi",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "071",
                title: "Haapavesi"
              }
            },
            {
              anchor: "072",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "072",
                forChangeObject: {
                  koodiarvo: "072",
                  title: "Hailuoto",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "072",
                title: "Hailuoto"
              }
            },
            {
              anchor: "084",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "084",
                forChangeObject: {
                  koodiarvo: "084",
                  title: "Haukipudas",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "084",
                title: "Haukipudas"
              }
            },
            {
              anchor: "095",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "095",
                forChangeObject: {
                  koodiarvo: "095",
                  title: "Himanka",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "095",
                title: "Himanka"
              }
            },
            {
              anchor: "139",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "139",
                forChangeObject: {
                  koodiarvo: "139",
                  title: "Ii",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "139",
                title: "Ii"
              }
            },
            {
              anchor: "208",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "208",
                forChangeObject: {
                  koodiarvo: "208",
                  title: "Kalajoki",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "208",
                title: "Kalajoki"
              }
            },
            {
              anchor: "244",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "244",
                forChangeObject: {
                  koodiarvo: "244",
                  title: "Kempele",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "244",
                title: "Kempele"
              }
            },
            {
              anchor: "247",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "247",
                forChangeObject: {
                  koodiarvo: "247",
                  title: "Kestilä",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "247",
                title: "Kestilä"
              }
            },
            {
              anchor: "255",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "255",
                forChangeObject: {
                  koodiarvo: "255",
                  title: "Kiiminki",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "255",
                title: "Kiiminki"
              }
            },
            {
              anchor: "292",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "292",
                forChangeObject: {
                  koodiarvo: "292",
                  title: "Kuivaniemi",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "292",
                title: "Kuivaniemi"
              }
            },
            {
              anchor: "305",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "305",
                forChangeObject: {
                  koodiarvo: "305",
                  title: "Kuusamo",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "305",
                title: "Kuusamo"
              }
            },
            {
              anchor: "317",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "317",
                forChangeObject: {
                  koodiarvo: "317",
                  title: "Kärsämäki",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "317",
                title: "Kärsämäki"
              }
            },
            {
              anchor: "425",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "425",
                forChangeObject: {
                  koodiarvo: "425",
                  title: "Liminka",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "425",
                title: "Liminka"
              }
            },
            {
              anchor: "436",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "436",
                forChangeObject: {
                  koodiarvo: "436",
                  title: "Lumijoki",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "436",
                title: "Lumijoki"
              }
            },
            {
              anchor: "483",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "483",
                forChangeObject: {
                  koodiarvo: "483",
                  title: "Merijärvi",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "483",
                title: "Merijärvi"
              }
            },
            {
              anchor: "494",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "494",
                forChangeObject: {
                  koodiarvo: "494",
                  title: "Muhos",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "494",
                title: "Muhos"
              }
            },
            {
              anchor: "535",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "535",
                forChangeObject: {
                  koodiarvo: "535",
                  title: "Nivala",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "535",
                title: "Nivala"
              }
            },
            {
              anchor: "563",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "563",
                forChangeObject: {
                  koodiarvo: "563",
                  title: "Oulainen",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "563",
                title: "Oulainen"
              }
            },
            {
              anchor: "564",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "564",
                forChangeObject: {
                  koodiarvo: "564",
                  title: "Oulu",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "564",
                title: "Oulu"
              }
            },
            {
              anchor: "567",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "567",
                forChangeObject: {
                  koodiarvo: "567",
                  title: "Oulunsalo",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "567",
                title: "Oulunsalo"
              }
            },
            {
              anchor: "582",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "582",
                forChangeObject: {
                  koodiarvo: "582",
                  title: "Pattijoki",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "582",
                title: "Pattijoki"
              }
            },
            {
              anchor: "603",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "603",
                forChangeObject: {
                  koodiarvo: "603",
                  title: "Piippola",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "603",
                title: "Piippola"
              }
            },
            {
              anchor: "615",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "615",
                forChangeObject: {
                  koodiarvo: "615",
                  title: "Pudasjärvi",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "615",
                title: "Pudasjärvi"
              }
            },
            {
              anchor: "617",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "617",
                forChangeObject: {
                  koodiarvo: "617",
                  title: "Pulkkila",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "617",
                title: "Pulkkila"
              }
            },
            {
              anchor: "625",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "625",
                forChangeObject: {
                  koodiarvo: "625",
                  title: "Pyhäjoki",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "625",
                title: "Pyhäjoki"
              }
            },
            {
              anchor: "626",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "626",
                forChangeObject: {
                  koodiarvo: "626",
                  title: "Pyhäjärvi",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "626",
                title: "Pyhäjärvi"
              }
            },
            {
              anchor: "630",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "630",
                forChangeObject: {
                  koodiarvo: "630",
                  title: "Pyhäntä",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "630",
                title: "Pyhäntä"
              }
            },
            {
              anchor: "678",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "678",
                forChangeObject: {
                  koodiarvo: "678",
                  title: "Raahe",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "678",
                title: "Raahe"
              }
            },
            {
              anchor: "682",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "682",
                forChangeObject: {
                  koodiarvo: "682",
                  title: "Rantsila",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "682",
                title: "Rantsila"
              }
            },
            {
              anchor: "691",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "691",
                forChangeObject: {
                  koodiarvo: "691",
                  title: "Reisjärvi",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "691",
                title: "Reisjärvi"
              }
            },
            {
              anchor: "708",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "708",
                forChangeObject: {
                  koodiarvo: "708",
                  title: "Ruukki",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "708",
                title: "Ruukki"
              }
            },
            {
              anchor: "746",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "746",
                forChangeObject: {
                  koodiarvo: "746",
                  title: "Sievi",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "746",
                title: "Sievi"
              }
            },
            {
              anchor: "748",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "748",
                forChangeObject: {
                  koodiarvo: "748",
                  title: "Siikajoki",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "748",
                title: "Siikajoki"
              }
            },
            {
              anchor: "791",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "791",
                forChangeObject: {
                  koodiarvo: "791",
                  title: "Siikalatva",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "791",
                title: "Siikalatva"
              }
            },
            {
              anchor: "832",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "832",
                forChangeObject: {
                  koodiarvo: "832",
                  title: "Taivalkoski",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "832",
                title: "Taivalkoski"
              }
            },
            {
              anchor: "841",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "841",
                forChangeObject: {
                  koodiarvo: "841",
                  title: "Temmes",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "841",
                title: "Temmes"
              }
            },
            {
              anchor: "859",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "859",
                forChangeObject: {
                  koodiarvo: "859",
                  title: "Tyrnävä",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "859",
                title: "Tyrnävä"
              }
            },
            {
              anchor: "889",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "889",
                forChangeObject: {
                  koodiarvo: "889",
                  title: "Utajärvi",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "889",
                title: "Utajärvi"
              }
            },
            {
              anchor: "785",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "785",
                forChangeObject: {
                  koodiarvo: "785",
                  title: "Vaala",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "785",
                title: "Vaala"
              }
            },
            {
              anchor: "926",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "926",
                forChangeObject: {
                  koodiarvo: "926",
                  title: "Vihanti",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "926",
                title: "Vihanti"
              }
            },
            {
              anchor: "972",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "972",
                forChangeObject: {
                  koodiarvo: "972",
                  title: "Yli-Ii",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "972",
                title: "Yli-Ii"
              }
            },
            {
              anchor: "973",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "973",
                forChangeObject: {
                  koodiarvo: "973",
                  title: "Ylikiiminki",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "973",
                title: "Ylikiiminki"
              }
            },
            {
              anchor: "977",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "977",
                forChangeObject: {
                  koodiarvo: "977",
                  title: "Ylivieska",
                  maakuntaKey: "FI-14"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "977",
                title: "Ylivieska"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-15",
      formId: "FI-15",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "11",
            forChangeObject: {
              koodiarvo: "11",
              maakuntaKey: "FI-15",
              title: "Pohjois-Savo"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "11",
            title: "Pohjois-Savo"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-15",
          components: [
            {
              anchor: "140",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "140",
                forChangeObject: {
                  koodiarvo: "140",
                  title: "Iisalmi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "140",
                title: "Iisalmi"
              }
            },
            {
              anchor: "174",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "174",
                forChangeObject: {
                  koodiarvo: "174",
                  title: "Juankoski",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "174",
                title: "Juankoski"
              }
            },
            {
              anchor: "204",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "204",
                forChangeObject: {
                  koodiarvo: "204",
                  title: "Kaavi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "204",
                title: "Kaavi"
              }
            },
            {
              anchor: "212",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "212",
                forChangeObject: {
                  koodiarvo: "212",
                  title: "Kangaslampi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "212",
                title: "Kangaslampi"
              }
            },
            {
              anchor: "227",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "227",
                forChangeObject: {
                  koodiarvo: "227",
                  title: "Karttula",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "227",
                title: "Karttula"
              }
            },
            {
              anchor: "239",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "239",
                forChangeObject: {
                  koodiarvo: "239",
                  title: "Keitele",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "239",
                title: "Keitele"
              }
            },
            {
              anchor: "263",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "263",
                forChangeObject: {
                  koodiarvo: "263",
                  title: "Kiuruvesi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "263",
                title: "Kiuruvesi"
              }
            },
            {
              anchor: "297",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "297",
                forChangeObject: {
                  koodiarvo: "297",
                  title: "Kuopio",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "297",
                title: "Kuopio"
              }
            },
            {
              anchor: "402",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "402",
                forChangeObject: {
                  koodiarvo: "402",
                  title: "Lapinlahti",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "402",
                title: "Lapinlahti"
              }
            },
            {
              anchor: "420",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "420",
                forChangeObject: {
                  koodiarvo: "420",
                  title: "Leppävirta",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "420",
                title: "Leppävirta"
              }
            },
            {
              anchor: "476",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "476",
                forChangeObject: {
                  koodiarvo: "476",
                  title: "Maaninka",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "476",
                title: "Maaninka"
              }
            },
            {
              anchor: "534",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "534",
                forChangeObject: {
                  koodiarvo: "534",
                  title: "Nilsiä",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "534",
                title: "Nilsiä"
              }
            },
            {
              anchor: "595",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "595",
                forChangeObject: {
                  koodiarvo: "595",
                  title: "Pielavesi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "595",
                title: "Pielavesi"
              }
            },
            {
              anchor: "686",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "686",
                forChangeObject: {
                  koodiarvo: "686",
                  title: "Rautalampi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "686",
                title: "Rautalampi"
              }
            },
            {
              anchor: "687",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "687",
                forChangeObject: {
                  koodiarvo: "687",
                  title: "Rautavaara",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "687",
                title: "Rautavaara"
              }
            },
            {
              anchor: "749",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "749",
                forChangeObject: {
                  koodiarvo: "749",
                  title: "Siilinjärvi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "749",
                title: "Siilinjärvi"
              }
            },
            {
              anchor: "762",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "762",
                forChangeObject: {
                  koodiarvo: "762",
                  title: "Sonkajärvi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "762",
                title: "Sonkajärvi"
              }
            },
            {
              anchor: "778",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "778",
                forChangeObject: {
                  koodiarvo: "778",
                  title: "Suonenjoki",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "778",
                title: "Suonenjoki"
              }
            },
            {
              anchor: "844",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "844",
                forChangeObject: {
                  koodiarvo: "844",
                  title: "Tervo",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "844",
                title: "Tervo"
              }
            },
            {
              anchor: "857",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "857",
                forChangeObject: {
                  koodiarvo: "857",
                  title: "Tuusniemi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "857",
                title: "Tuusniemi"
              }
            },
            {
              anchor: "915",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "915",
                forChangeObject: {
                  koodiarvo: "915",
                  title: "Varkaus",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "915",
                title: "Varkaus"
              }
            },
            {
              anchor: "916",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "916",
                forChangeObject: {
                  koodiarvo: "916",
                  title: "Varpaisjärvi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "916",
                title: "Varpaisjärvi"
              }
            },
            {
              anchor: "919",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "919",
                forChangeObject: {
                  koodiarvo: "919",
                  title: "Vehmersalmi",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "919",
                title: "Vehmersalmi"
              }
            },
            {
              anchor: "921",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "921",
                forChangeObject: {
                  koodiarvo: "921",
                  title: "Vesanto",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "921",
                title: "Vesanto"
              }
            },
            {
              anchor: "925",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "925",
                forChangeObject: {
                  koodiarvo: "925",
                  title: "Vieremä",
                  maakuntaKey: "FI-15"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "925",
                title: "Vieremä"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-16",
      formId: "FI-16",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "07",
            forChangeObject: {
              koodiarvo: "07",
              maakuntaKey: "FI-16",
              title: "Päijät-Häme"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "07",
            title: "Päijät-Häme"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-16",
          components: [
            {
              anchor: "015",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "015",
                forChangeObject: {
                  koodiarvo: "015",
                  title: "Artjärvi",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "015",
                title: "Artjärvi"
              }
            },
            {
              anchor: "016",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "016",
                forChangeObject: {
                  koodiarvo: "016",
                  title: "Asikkala",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "016",
                title: "Asikkala"
              }
            },
            {
              anchor: "081",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "081",
                forChangeObject: {
                  koodiarvo: "081",
                  title: "Hartola",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "081",
                title: "Hartola"
              }
            },
            {
              anchor: "111",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "111",
                forChangeObject: {
                  koodiarvo: "111",
                  title: "Heinola",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "111",
                title: "Heinola"
              }
            },
            {
              anchor: "088",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "088",
                forChangeObject: {
                  koodiarvo: "088",
                  title: "Heinola",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "088",
                title: "Heinola"
              }
            },
            {
              anchor: "089",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "089",
                forChangeObject: {
                  koodiarvo: "089",
                  title: "Heinola mlk",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "089",
                title: "Heinola mlk"
              }
            },
            {
              anchor: "098",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "098",
                forChangeObject: {
                  koodiarvo: "098",
                  title: "Hollola",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "098",
                title: "Hollola"
              }
            },
            {
              anchor: "283",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "283",
                forChangeObject: {
                  koodiarvo: "283",
                  title: "Hämeenkoski",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "283",
                title: "Hämeenkoski"
              }
            },
            {
              anchor: "316",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "316",
                forChangeObject: {
                  koodiarvo: "316",
                  title: "Kärkölä",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "316",
                title: "Kärkölä"
              }
            },
            {
              anchor: "398",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "398",
                forChangeObject: {
                  koodiarvo: "398",
                  title: "Lahti",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "398",
                title: "Lahti"
              }
            },
            {
              anchor: "532",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "532",
                forChangeObject: {
                  koodiarvo: "532",
                  title: "Nastola",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "532",
                title: "Nastola"
              }
            },
            {
              anchor: "560",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "560",
                forChangeObject: {
                  koodiarvo: "560",
                  title: "Orimattila",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "560",
                title: "Orimattila"
              }
            },
            {
              anchor: "576",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "576",
                forChangeObject: {
                  koodiarvo: "576",
                  title: "Padasjoki",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "576",
                title: "Padasjoki"
              }
            },
            {
              anchor: "781",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "781",
                forChangeObject: {
                  koodiarvo: "781",
                  title: "Sysmä",
                  maakuntaKey: "FI-16"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "781",
                title: "Sysmä"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-17",
      formId: "FI-17",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "04",
            forChangeObject: {
              koodiarvo: "04",
              maakuntaKey: "FI-17",
              title: "Satakunta"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "04",
            title: "Satakunta"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-17",
          components: [
            {
              anchor: "001",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "001",
                forChangeObject: {
                  koodiarvo: "001",
                  title: "Ahlainen",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "001",
                title: "Ahlainen"
              }
            },
            {
              anchor: "050",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "050",
                forChangeObject: {
                  koodiarvo: "050",
                  title: "Eura",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "050",
                title: "Eura"
              }
            },
            {
              anchor: "051",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "051",
                forChangeObject: {
                  koodiarvo: "051",
                  title: "Eurajoki",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "051",
                title: "Eurajoki"
              }
            },
            {
              anchor: "079",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "079",
                forChangeObject: {
                  koodiarvo: "079",
                  title: "Harjavalta",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "079",
                title: "Harjavalta"
              }
            },
            {
              anchor: "099",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "099",
                forChangeObject: {
                  koodiarvo: "099",
                  title: "Honkajoki",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "099",
                title: "Honkajoki"
              }
            },
            {
              anchor: "102",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "102",
                forChangeObject: {
                  koodiarvo: "102",
                  title: "Huittinen",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "102",
                title: "Huittinen"
              }
            },
            {
              anchor: "181",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "181",
                forChangeObject: {
                  koodiarvo: "181",
                  title: "Jämijärvi",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "181",
                title: "Jämijärvi"
              }
            },
            {
              anchor: "214",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "214",
                forChangeObject: {
                  koodiarvo: "214",
                  title: "Kankaanpää",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "214",
                title: "Kankaanpää"
              }
            },
            {
              anchor: "230",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "230",
                forChangeObject: {
                  koodiarvo: "230",
                  title: "Karvia",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "230",
                title: "Karvia"
              }
            },
            {
              anchor: "254",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "254",
                forChangeObject: {
                  koodiarvo: "254",
                  title: "Kiikoinen",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "254",
                title: "Kiikoinen"
              }
            },
            {
              anchor: "262",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "262",
                forChangeObject: {
                  koodiarvo: "262",
                  title: "Kiukainen",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "262",
                title: "Kiukainen"
              }
            },
            {
              anchor: "266",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "266",
                forChangeObject: {
                  koodiarvo: "266",
                  title: "Kodisjoki",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "266",
                title: "Kodisjoki"
              }
            },
            {
              anchor: "271",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "271",
                forChangeObject: {
                  koodiarvo: "271",
                  title: "Kokemäki",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "271",
                title: "Kokemäki"
              }
            },
            {
              anchor: "293",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "293",
                forChangeObject: {
                  koodiarvo: "293",
                  title: "Kullaa",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "293",
                title: "Kullaa"
              }
            },
            {
              anchor: "319",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "319",
                forChangeObject: {
                  koodiarvo: "319",
                  title: "Köyliö",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "319",
                title: "Köyliö"
              }
            },
            {
              anchor: "406",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "406",
                forChangeObject: {
                  koodiarvo: "406",
                  title: "Lappi",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "406",
                title: "Lappi"
              }
            },
            {
              anchor: "413",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "413",
                forChangeObject: {
                  koodiarvo: "413",
                  title: "Lavia",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "413",
                title: "Lavia"
              }
            },
            {
              anchor: "442",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "442",
                forChangeObject: {
                  koodiarvo: "442",
                  title: "Luvia",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "442",
                title: "Luvia"
              }
            },
            {
              anchor: "484",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "484",
                forChangeObject: {
                  koodiarvo: "484",
                  title: "Merikarvia",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "484",
                title: "Merikarvia"
              }
            },
            {
              anchor: "531",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "531",
                forChangeObject: {
                  koodiarvo: "531",
                  title: "Nakkila",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "531",
                title: "Nakkila"
              }
            },
            {
              anchor: "537",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "537",
                forChangeObject: {
                  koodiarvo: "537",
                  title: "Noormarkku",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "537",
                title: "Noormarkku"
              }
            },
            {
              anchor: "608",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "608",
                forChangeObject: {
                  koodiarvo: "608",
                  title: "Pomarkku",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "608",
                title: "Pomarkku"
              }
            },
            {
              anchor: "609",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "609",
                forChangeObject: {
                  koodiarvo: "609",
                  title: "Pori",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "609",
                title: "Pori"
              }
            },
            {
              anchor: "684",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "684",
                forChangeObject: {
                  koodiarvo: "684",
                  title: "Rauma",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "684",
                title: "Rauma"
              }
            },
            {
              anchor: "747",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "747",
                forChangeObject: {
                  koodiarvo: "747",
                  title: "Siikainen",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "747",
                title: "Siikainen"
              }
            },
            {
              anchor: "783",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "783",
                forChangeObject: {
                  koodiarvo: "783",
                  title: "Säkylä",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "783",
                title: "Säkylä"
              }
            },
            {
              anchor: "886",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "886",
                forChangeObject: {
                  koodiarvo: "886",
                  title: "Ulvila",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "886",
                title: "Ulvila"
              }
            },
            {
              anchor: "913",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "913",
                forChangeObject: {
                  koodiarvo: "913",
                  title: "Vampula",
                  maakuntaKey: "FI-17"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "913",
                title: "Vampula"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-18",
      formId: "FI-18",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "01",
            forChangeObject: {
              koodiarvo: "01",
              maakuntaKey: "FI-18",
              title: "Uusimaa"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "01",
            title: "Uusimaa"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-18",
          components: [
            {
              anchor: "018",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "018",
                forChangeObject: {
                  koodiarvo: "018",
                  title: "Askola",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "018",
                title: "Askola"
              }
            },
            {
              anchor: "049",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "049",
                forChangeObject: {
                  koodiarvo: "049",
                  title: "Espoo",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "049",
                title: "Espoo"
              }
            },
            {
              anchor: "078",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "078",
                forChangeObject: {
                  koodiarvo: "078",
                  title: "Hanko",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "078",
                title: "Hanko"
              }
            },
            {
              anchor: "091",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "091",
                forChangeObject: {
                  koodiarvo: "091",
                  title: "Helsinki",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "091",
                title: "Helsinki"
              }
            },
            {
              anchor: "106",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "106",
                forChangeObject: {
                  koodiarvo: "106",
                  title: "Hyvinkää",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "106",
                title: "Hyvinkää"
              }
            },
            {
              anchor: "149",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "149",
                forChangeObject: {
                  koodiarvo: "149",
                  title: "Inkoo",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "149",
                title: "Inkoo"
              }
            },
            {
              anchor: "186",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "186",
                forChangeObject: {
                  koodiarvo: "186",
                  title: "Järvenpää",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "186",
                title: "Järvenpää"
              }
            },
            {
              anchor: "220",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "220",
                forChangeObject: {
                  koodiarvo: "220",
                  title: "Karjaa",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "220",
                title: "Karjaa"
              }
            },
            {
              anchor: "223",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "223",
                forChangeObject: {
                  koodiarvo: "223",
                  title: "Karjalohja",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "223",
                title: "Karjalohja"
              }
            },
            {
              anchor: "224",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "224",
                forChangeObject: {
                  koodiarvo: "224",
                  title: "Karkkila",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "224",
                title: "Karkkila"
              }
            },
            {
              anchor: "235",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "235",
                forChangeObject: {
                  koodiarvo: "235",
                  title: "Kauniainen",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "235",
                title: "Kauniainen"
              }
            },
            {
              anchor: "245",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "245",
                forChangeObject: {
                  koodiarvo: "245",
                  title: "Kerava",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "245",
                title: "Kerava"
              }
            },
            {
              anchor: "257",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "257",
                forChangeObject: {
                  koodiarvo: "257",
                  title: "Kirkkonummi",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "257",
                title: "Kirkkonummi"
              }
            },
            {
              anchor: "407",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "407",
                forChangeObject: {
                  koodiarvo: "407",
                  title: "Lapinjärvi",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "407",
                title: "Lapinjärvi"
              }
            },
            {
              anchor: "424",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "424",
                forChangeObject: {
                  koodiarvo: "424",
                  title: "Liljendal",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "424",
                title: "Liljendal"
              }
            },
            {
              anchor: "427",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "427",
                forChangeObject: {
                  koodiarvo: "427",
                  title: "Lohja",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "427",
                title: "Lohja"
              }
            },
            {
              anchor: "444",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "444",
                forChangeObject: {
                  koodiarvo: "444",
                  title: "Lohja",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "444",
                title: "Lohja"
              }
            },
            {
              anchor: "428",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "428",
                forChangeObject: {
                  koodiarvo: "428",
                  title: "Lohjan kunta",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "428",
                title: "Lohjan kunta"
              }
            },
            {
              anchor: "434",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "434",
                forChangeObject: {
                  koodiarvo: "434",
                  title: "Loviisa",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "434",
                title: "Loviisa"
              }
            },
            {
              anchor: "504",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "504",
                forChangeObject: {
                  koodiarvo: "504",
                  title: "Myrskylä",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "504",
                title: "Myrskylä"
              }
            },
            {
              anchor: "505",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "505",
                forChangeObject: {
                  koodiarvo: "505",
                  title: "Mäntsälä",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "505",
                title: "Mäntsälä"
              }
            },
            {
              anchor: "540",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "540",
                forChangeObject: {
                  koodiarvo: "540",
                  title: "Nummi-Pusula",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "540",
                title: "Nummi-Pusula"
              }
            },
            {
              anchor: "543",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "543",
                forChangeObject: {
                  koodiarvo: "543",
                  title: "Nurmijärvi",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "543",
                title: "Nurmijärvi"
              }
            },
            {
              anchor: "585",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "585",
                forChangeObject: {
                  koodiarvo: "585",
                  title: "Pernaja",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "585",
                title: "Pernaja"
              }
            },
            {
              anchor: "606",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "606",
                forChangeObject: {
                  koodiarvo: "606",
                  title: "Pohja",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "606",
                title: "Pohja"
              }
            },
            {
              anchor: "611",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "611",
                forChangeObject: {
                  koodiarvo: "611",
                  title: "Pornainen",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "611",
                title: "Pornainen"
              }
            },
            {
              anchor: "638",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "638",
                forChangeObject: {
                  koodiarvo: "638",
                  title: "Porvoo",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "638",
                title: "Porvoo"
              }
            },
            {
              anchor: "612",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "612",
                forChangeObject: {
                  koodiarvo: "612",
                  title: "Porvoo",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "612",
                title: "Porvoo"
              }
            },
            {
              anchor: "613",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "613",
                forChangeObject: {
                  koodiarvo: "613",
                  title: "Porvoo mlk",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "613",
                title: "Porvoo mlk"
              }
            },
            {
              anchor: "616",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "616",
                forChangeObject: {
                  koodiarvo: "616",
                  title: "Pukkila",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "616",
                title: "Pukkila"
              }
            },
            {
              anchor: "710",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "710",
                forChangeObject: {
                  koodiarvo: "710",
                  title: "Raasepori",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "710",
                title: "Raasepori"
              }
            },
            {
              anchor: "701",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "701",
                forChangeObject: {
                  koodiarvo: "701",
                  title: "Ruotsinpyhtää",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "701",
                title: "Ruotsinpyhtää"
              }
            },
            {
              anchor: "737",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "737",
                forChangeObject: {
                  koodiarvo: "737",
                  title: "Sammatti",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "737",
                title: "Sammatti"
              }
            },
            {
              anchor: "753",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "753",
                forChangeObject: {
                  koodiarvo: "753",
                  title: "Sipoo",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "753",
                title: "Sipoo"
              }
            },
            {
              anchor: "755",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "755",
                forChangeObject: {
                  koodiarvo: "755",
                  title: "Siuntio",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "755",
                title: "Siuntio"
              }
            },
            {
              anchor: "835",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "835",
                forChangeObject: {
                  koodiarvo: "835",
                  title: "Tammisaari",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "835",
                title: "Tammisaari"
              }
            },
            {
              anchor: "858",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "858",
                forChangeObject: {
                  koodiarvo: "858",
                  title: "Tuusula",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "858",
                title: "Tuusula"
              }
            },
            {
              anchor: "200",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "200",
                forChangeObject: {
                  koodiarvo: "200",
                  title: "Ulkomaa",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "200",
                title: "Ulkomaa"
              }
            },
            {
              anchor: "092",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "092",
                forChangeObject: {
                  koodiarvo: "092",
                  title: "Vantaa",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "092",
                title: "Vantaa"
              }
            },
            {
              anchor: "927",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "927",
                forChangeObject: {
                  koodiarvo: "927",
                  title: "Vihti",
                  maakuntaKey: "FI-18"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "927",
                title: "Vihti"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "FI-19",
      formId: "FI-19",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "02",
            forChangeObject: {
              koodiarvo: "02",
              maakuntaKey: "FI-19",
              title: "Varsinais-Suomi"
            },
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: {
                color: "purple"
              },
              removal: {
                color: "purple",
                textDecoration: "line-through"
              },
              custom: {
                fontWeight: 600
              }
            },
            name: "02",
            title: "Varsinais-Suomi"
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: "FI-19",
          components: [
            {
              anchor: "006",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "006",
                forChangeObject: {
                  koodiarvo: "006",
                  title: "Alastaro",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "006",
                title: "Alastaro"
              }
            },
            {
              anchor: "017",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "017",
                forChangeObject: {
                  koodiarvo: "017",
                  title: "Askainen",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "017",
                title: "Askainen"
              }
            },
            {
              anchor: "019",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "019",
                forChangeObject: {
                  koodiarvo: "019",
                  title: "Aura",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "019",
                title: "Aura"
              }
            },
            {
              anchor: "040",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "040",
                forChangeObject: {
                  koodiarvo: "040",
                  title: "Dragsfjärd",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "040",
                title: "Dragsfjärd"
              }
            },
            {
              anchor: "073",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "073",
                forChangeObject: {
                  koodiarvo: "073",
                  title: "Halikko",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "073",
                title: "Halikko"
              }
            },
            {
              anchor: "101",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "101",
                forChangeObject: {
                  koodiarvo: "101",
                  title: "Houtskari",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "101",
                title: "Houtskari"
              }
            },
            {
              anchor: "150",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "150",
                forChangeObject: {
                  koodiarvo: "150",
                  title: "Iniö",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "150",
                title: "Iniö"
              }
            },
            {
              anchor: "202",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "202",
                forChangeObject: {
                  koodiarvo: "202",
                  title: "Kaarina",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "202",
                title: "Kaarina"
              }
            },
            {
              anchor: "219",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "219",
                forChangeObject: {
                  koodiarvo: "219",
                  title: "Karinainen",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "219",
                title: "Karinainen"
              }
            },
            {
              anchor: "243",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "243",
                forChangeObject: {
                  koodiarvo: "243",
                  title: "Kemiö",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "243",
                title: "Kemiö"
              }
            },
            {
              anchor: "322",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "322",
                forChangeObject: {
                  koodiarvo: "322",
                  title: "Kemiönsaari",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "322",
                title: "Kemiönsaari"
              }
            },
            {
              anchor: "252",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "252",
                forChangeObject: {
                  koodiarvo: "252",
                  title: "Kiikala",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "252",
                title: "Kiikala"
              }
            },
            {
              anchor: "259",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "259",
                forChangeObject: {
                  koodiarvo: "259",
                  title: "Kisko",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "259",
                title: "Kisko"
              }
            },
            {
              anchor: "279",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "279",
                forChangeObject: {
                  koodiarvo: "279",
                  title: "Korppoo",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "279",
                title: "Korppoo"
              }
            },
            {
              anchor: "284",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "284",
                forChangeObject: {
                  koodiarvo: "284",
                  title: "Koski Tl",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "284",
                title: "Koski Tl"
              }
            },
            {
              anchor: "304",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "304",
                forChangeObject: {
                  koodiarvo: "304",
                  title: "Kustavi",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "304",
                title: "Kustavi"
              }
            },
            {
              anchor: "308",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "308",
                forChangeObject: {
                  koodiarvo: "308",
                  title: "Kuusjoki",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "308",
                title: "Kuusjoki"
              }
            },
            {
              anchor: "400",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "400",
                forChangeObject: {
                  koodiarvo: "400",
                  title: "Laitila",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "400",
                title: "Laitila"
              }
            },
            {
              anchor: "419",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "419",
                forChangeObject: {
                  koodiarvo: "419",
                  title: "Lemu",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "419",
                title: "Lemu"
              }
            },
            {
              anchor: "423",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "423",
                forChangeObject: {
                  koodiarvo: "423",
                  title: "Lieto",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "423",
                title: "Lieto"
              }
            },
            {
              anchor: "430",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "430",
                forChangeObject: {
                  koodiarvo: "430",
                  title: "Loimaa",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "430",
                title: "Loimaa"
              }
            },
            {
              anchor: "431",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "431",
                forChangeObject: {
                  koodiarvo: "431",
                  title: "Loimaan kunta",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "431",
                title: "Loimaan kunta"
              }
            },
            {
              anchor: "480",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "480",
                forChangeObject: {
                  koodiarvo: "480",
                  title: "Marttila",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "480",
                title: "Marttila"
              }
            },
            {
              anchor: "481",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "481",
                forChangeObject: {
                  koodiarvo: "481",
                  title: "Masku",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "481",
                title: "Masku"
              }
            },
            {
              anchor: "482",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "482",
                forChangeObject: {
                  koodiarvo: "482",
                  title: "Mellilä",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "482",
                title: "Mellilä"
              }
            },
            {
              anchor: "485",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "485",
                forChangeObject: {
                  koodiarvo: "485",
                  title: "Merimasku",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "485",
                title: "Merimasku"
              }
            },
            {
              anchor: "490",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "490",
                forChangeObject: {
                  koodiarvo: "490",
                  title: "Mietoinen",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "490",
                title: "Mietoinen"
              }
            },
            {
              anchor: "501",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "501",
                forChangeObject: {
                  koodiarvo: "501",
                  title: "Muurla",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "501",
                title: "Muurla"
              }
            },
            {
              anchor: "503",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "503",
                forChangeObject: {
                  koodiarvo: "503",
                  title: "Mynämäki",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "503",
                title: "Mynämäki"
              }
            },
            {
              anchor: "529",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "529",
                forChangeObject: {
                  koodiarvo: "529",
                  title: "Naantali",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "529",
                title: "Naantali"
              }
            },
            {
              anchor: "533",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "533",
                forChangeObject: {
                  koodiarvo: "533",
                  title: "Nauvo",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "533",
                title: "Nauvo"
              }
            },
            {
              anchor: "538",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "538",
                forChangeObject: {
                  koodiarvo: "538",
                  title: "Nousiainen",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "538",
                title: "Nousiainen"
              }
            },
            {
              anchor: "561",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "561",
                forChangeObject: {
                  koodiarvo: "561",
                  title: "Oripää",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "561",
                title: "Oripää"
              }
            },
            {
              anchor: "577",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "577",
                forChangeObject: {
                  koodiarvo: "577",
                  title: "Paimio",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "577",
                title: "Paimio"
              }
            },
            {
              anchor: "573",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "573",
                forChangeObject: {
                  koodiarvo: "573",
                  title: "Parainen",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "573",
                title: "Parainen"
              }
            },
            {
              anchor: "445",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "445",
                forChangeObject: {
                  koodiarvo: "445",
                  title: "Parainen",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "445",
                title: "Parainen"
              }
            },
            {
              anchor: "586",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "586",
                forChangeObject: {
                  koodiarvo: "586",
                  title: "Perniö",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "586",
                title: "Perniö"
              }
            },
            {
              anchor: "587",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "587",
                forChangeObject: {
                  koodiarvo: "587",
                  title: "Pertteli",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "587",
                title: "Pertteli"
              }
            },
            {
              anchor: "602",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "602",
                forChangeObject: {
                  koodiarvo: "602",
                  title: "Piikkiö",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "602",
                title: "Piikkiö"
              }
            },
            {
              anchor: "631",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "631",
                forChangeObject: {
                  koodiarvo: "631",
                  title: "Pyhäranta",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "631",
                title: "Pyhäranta"
              }
            },
            {
              anchor: "636",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "636",
                forChangeObject: {
                  koodiarvo: "636",
                  title: "Pöytyä",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "636",
                title: "Pöytyä"
              }
            },
            {
              anchor: "680",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "680",
                forChangeObject: {
                  koodiarvo: "680",
                  title: "Raisio",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "680",
                title: "Raisio"
              }
            },
            {
              anchor: "704",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "704",
                forChangeObject: {
                  koodiarvo: "704",
                  title: "Rusko",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "704",
                title: "Rusko"
              }
            },
            {
              anchor: "705",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "705",
                forChangeObject: {
                  koodiarvo: "705",
                  title: "Rymättylä",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "705",
                title: "Rymättylä"
              }
            },
            {
              anchor: "734",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "734",
                forChangeObject: {
                  koodiarvo: "734",
                  title: "Salo",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "734",
                title: "Salo"
              }
            },
            {
              anchor: "738",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "738",
                forChangeObject: {
                  koodiarvo: "738",
                  title: "Sauvo",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "738",
                title: "Sauvo"
              }
            },
            {
              anchor: "761",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "761",
                forChangeObject: {
                  koodiarvo: "761",
                  title: "Somero",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "761",
                title: "Somero"
              }
            },
            {
              anchor: "776",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "776",
                forChangeObject: {
                  koodiarvo: "776",
                  title: "Suomusjärvi",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "776",
                title: "Suomusjärvi"
              }
            },
            {
              anchor: "784",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "784",
                forChangeObject: {
                  koodiarvo: "784",
                  title: "Särkisalo",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "784",
                title: "Särkisalo"
              }
            },
            {
              anchor: "833",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "833",
                forChangeObject: {
                  koodiarvo: "833",
                  title: "Taivassalo",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "833",
                title: "Taivassalo"
              }
            },
            {
              anchor: "838",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "838",
                forChangeObject: {
                  koodiarvo: "838",
                  title: "Tarvasjoki",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "838",
                title: "Tarvasjoki"
              }
            },
            {
              anchor: "853",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "853",
                forChangeObject: {
                  koodiarvo: "853",
                  title: "Turku",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "853",
                title: "Turku"
              }
            },
            {
              anchor: "895",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "895",
                forChangeObject: {
                  koodiarvo: "895",
                  title: "Uusikaupunki",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "895",
                title: "Uusikaupunki"
              }
            },
            {
              anchor: "906",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "906",
                forChangeObject: {
                  koodiarvo: "906",
                  title: "Vahto",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "906",
                title: "Vahto"
              }
            },
            {
              anchor: "918",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "918",
                forChangeObject: {
                  koodiarvo: "918",
                  title: "Vehmaa",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "918",
                title: "Vehmaa"
              }
            },
            {
              anchor: "920",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "920",
                forChangeObject: {
                  koodiarvo: "920",
                  title: "Velkua",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "920",
                title: "Velkua"
              }
            },
            {
              anchor: "923",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "923",
                forChangeObject: {
                  koodiarvo: "923",
                  title: "Västanfjärd",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "923",
                title: "Västanfjärd"
              }
            },
            {
              anchor: "979",
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2"],
              properties: {
                code: "979",
                forChangeObject: {
                  koodiarvo: "979",
                  title: "Yläne",
                  maakuntaKey: "FI-19"
                },
                isChecked: true,
                labelStyles: {
                  addition: {
                    color: "purple"
                  },
                  removal: {
                    color: "purple",
                    textDecoration: "line-through"
                  },
                  custom: {
                    fontWeight: 600
                  }
                },
                name: "979",
                title: "Yläne"
              }
            }
          ]
        }
      ]
    }
  ]
};
