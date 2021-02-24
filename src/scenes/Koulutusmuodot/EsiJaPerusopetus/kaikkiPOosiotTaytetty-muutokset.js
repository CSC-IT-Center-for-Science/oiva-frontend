export const muutokset = {
  changeObjects: {
    saved: {
      erityisetKoulutustehtavat: [
        {
          anchor: "erityisetKoulutustehtavat.1.valintaelementti",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "erityisetKoulutustehtavat.2.valintaelementti",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "erityisetKoulutustehtavat.2.0.kuvaus",
          properties: {
            value: "Kieliä ja kulttuuria 0",
            metadata: {
              ankkuri: "0",
              koodiarvo: "2"
            }
          }
        },
        {
          anchor: "erityisetKoulutustehtavat.2.1.kuvaus",
          properties: {
            value: "Kieliä ja kulttuuria 1",
            metadata: {
              ankkuri: "1",
              koodiarvo: "2",
              focusWhenDeleted: "erityisetKoulutustehtavat.2.0.kuvaus"
            }
          }
        },
        {
          anchor: "erityisetKoulutustehtavat.2.2.kuvaus",
          properties: {
            value: "Kieliä ja kulttuuria 2",
            metadata: {
              ankkuri: "2",
              koodiarvo: "2",
              focusWhenDeleted: "erityisetKoulutustehtavat.2.1.kuvaus"
            }
          }
        }
      ],
      rajoitteet: {
        "02c6684a-e33f-4b8b-9f7a-0a73bb2ebe97": [
          {
            anchor:
              "rajoitteet_02c6684a-e33f-4b8b-9f7a-0a73bb2ebe97.kohdennukset.0.rajoite.kohde.valikko",
            properties: {
              value: {
                label: "Muut koulutuksen järjestämiseen liittyvät ehdot",
                value: "muutEhdot"
              }
            }
          },
          {
            anchor:
              "rajoitteet_02c6684a-e33f-4b8b-9f7a-0a73bb2ebe97.kohdennukset.0.rajoite.kohde.tarkennin.komponentti",
            properties: {
              value: {
                label: "Kristillinen maailmankatsomus",
                value: "1-0"
              },
              metadata: {
                section: "muutEhdot"
              }
            }
          },
          {
            anchor:
              "rajoitteet_02c6684a-e33f-4b8b-9f7a-0a73bb2ebe97.kohdennukset.0.rajoite.asetukset.0.kohde",
            properties: {
              value: {
                label: "Kunnat, joissa opetusta järjestetään",
                value: "toimintaalue"
              }
            }
          },
          {
            anchor:
              "rajoitteet_02c6684a-e33f-4b8b-9f7a-0a73bb2ebe97.kohdennukset.0.rajoite.asetukset.0.tarkennin.komponentti",
            properties: {
              value: {
                label: "Kannonkoski",
                value: "216"
              },
              metadata: {
                section: "opetustaAntavatKunnat"
              }
            }
          }
        ],
        "b5028f80-f002-415c-9ead-05da57988016": [
          {
            anchor:
              "rajoitteet_b5028f80-f002-415c-9ead-05da57988016.kohdennukset.0.rajoite.kohde.valikko",
            properties: {
              value: {
                label: "Muut koulutuksen järjestämiseen liittyvät ehdot",
                value: "muutEhdot"
              }
            }
          },
          {
            anchor:
              "rajoitteet_b5028f80-f002-415c-9ead-05da57988016.kohdennukset.0.rajoite.kohde.tarkennin.komponentti",
            properties: {
              value: {
                label: "Kristillinen maailmankatsomus",
                value: "1-0"
              },
              metadata: {
                section: "muutEhdot"
              }
            }
          },
          {
            anchor:
              "rajoitteet_b5028f80-f002-415c-9ead-05da57988016.kohdennukset.0.rajoite.asetukset.0.kohde",
            properties: {
              value: {
                label: "Opetus, jota lupa koskee",
                value: "opetustehtavat"
              }
            }
          },
          {
            anchor:
              "rajoitteet_b5028f80-f002-415c-9ead-05da57988016.kohdennukset.0.rajoite.asetukset.0.tarkennin.komponentti",
            properties: {
              value: {
                label:
                  "enintään kaksi vuotta kestävä esiopetus kehitysvammaisille ja psyykkisesti häiriytyneille lapsille",
                value: "2"
              },
              metadata: {
                section: "getOpetustehtavatLomake"
              }
            }
          },
          {
            anchor:
              "rajoitteet_b5028f80-f002-415c-9ead-05da57988016.kohdennukset.0.rajoite.asetukset.1.kohde",
            properties: {
              value: {
                label: "määräaika",
                value: "kujalisamaareetlisaksiajalla_1"
              }
            }
          },
          {
            anchor:
              "rajoitteet_b5028f80-f002-415c-9ead-05da57988016.kohdennukset.0.rajoite.asetukset.1.tarkennin.paattymispaiva",
            properties: {
              value: "2021-04-30T06:43:00.000Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          },
          {
            anchor:
              "rajoitteet_b5028f80-f002-415c-9ead-05da57988016.kohdennukset.0.rajoite.asetukset.1.tarkennin.alkamispaiva",
            properties: {
              value: "2021-02-23T07:43:24.063Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          }
        ],
        "5a134cb5-a3e3-44df-bb88-92014f6b364a": [
          {
            anchor:
              "rajoitteet_5a134cb5-a3e3-44df-bb88-92014f6b364a.kohdennukset.0.rajoite.kohde.valikko",
            properties: {
              value: {
                label: "Opetuksen järjestämismuodot",
                value: "opetuksenJarjestamismuodot"
              }
            }
          },
          {
            anchor:
              "rajoitteet_5a134cb5-a3e3-44df-bb88-92014f6b364a.kohdennukset.0.rajoite.kohde.tarkennin.komponentti",
            properties: {
              value: {
                label: "Sisäoppilaitosmuotoinen opetus",
                value: "1"
              },
              metadata: {
                section: "opetuksenJarjestamismuoto"
              }
            }
          },
          {
            anchor:
              "rajoitteet_5a134cb5-a3e3-44df-bb88-92014f6b364a.kohdennukset.0.rajoite.asetukset.0.kohde",
            properties: {
              value: {
                label: "Opetuskieli",
                value: "opetuskielet"
              }
            }
          },
          {
            anchor:
              "rajoitteet_5a134cb5-a3e3-44df-bb88-92014f6b364a.kohdennukset.0.rajoite.asetukset.0.tarkennin.komponentti",
            properties: {
              value: {
                label: "hollanti",
                value: "NL"
              },
              metadata: {
                section: "opetuskielet"
              }
            }
          }
        ],
        "62bf1520-1cf8-4df7-ab52-f48b95624b4d": [
          {
            anchor:
              "rajoitteet_62bf1520-1cf8-4df7-ab52-f48b95624b4d.kohdennukset.0.rajoite.kohde.valikko",
            properties: {
              value: {
                label: "Opetuksen järjestämismuodot",
                value: "opetuksenJarjestamismuodot"
              }
            }
          },
          {
            anchor:
              "rajoitteet_62bf1520-1cf8-4df7-ab52-f48b95624b4d.kohdennukset.0.rajoite.kohde.tarkennin.komponentti",
            properties: {
              value: {
                label: "Sisäoppilaitosmuotoinen opetus",
                value: "1"
              },
              metadata: {
                section: "opetuksenJarjestamismuoto"
              }
            }
          },
          {
            anchor:
              "rajoitteet_62bf1520-1cf8-4df7-ab52-f48b95624b4d.kohdennukset.0.rajoite.asetukset.0.kohde",
            properties: {
              value: {
                label: "Opetus, jota lupa koskee",
                value: "opetustehtavat"
              }
            }
          },
          {
            anchor:
              "rajoitteet_62bf1520-1cf8-4df7-ab52-f48b95624b4d.kohdennukset.0.rajoite.asetukset.0.tarkennin.komponentti",
            properties: {
              value: {
                label: "enintään kaksi vuotta kestävä esiopetus",
                value: "3"
              },
              metadata: {
                section: "getOpetustehtavatLomake"
              }
            }
          },
          {
            anchor:
              "rajoitteet_62bf1520-1cf8-4df7-ab52-f48b95624b4d.kohdennukset.0.rajoite.asetukset.1.kohde",
            properties: {
              value: {
                label: "Opetuskieli",
                value: "opetuskielet"
              }
            }
          },
          {
            anchor:
              "rajoitteet_62bf1520-1cf8-4df7-ab52-f48b95624b4d.kohdennukset.0.rajoite.asetukset.1.tarkennin.komponentti",
            properties: {
              value: {
                label: "ruotsi",
                value: "SV"
              },
              metadata: {
                section: "opetuskielet"
              }
            }
          }
        ],
        "13fc8b18-f169-4fc2-9ab5-c2c840c38b18": [
          {
            anchor:
              "rajoitteet_13fc8b18-f169-4fc2-9ab5-c2c840c38b18.kohdennukset.0.rajoite.kohde.valikko",
            properties: {
              value: {
                label: "Opetus, jota lupa koskee",
                value: "opetustehtavat"
              }
            }
          },
          {
            anchor:
              "rajoitteet_13fc8b18-f169-4fc2-9ab5-c2c840c38b18.kohdennukset.0.rajoite.kohde.tarkennin.komponentti",
            properties: {
              value: {
                label: "esiopetus",
                value: "6"
              },
              metadata: {
                section: "getOpetustehtavatLomake"
              }
            }
          },
          {
            anchor:
              "rajoitteet_13fc8b18-f169-4fc2-9ab5-c2c840c38b18.kohdennukset.0.rajoite.asetukset.0.kohde",
            properties: {
              value: {
                label: "määräaika",
                value: "kujalisamaareetlisaksiajalla_1"
              }
            }
          },
          {
            anchor:
              "rajoitteet_13fc8b18-f169-4fc2-9ab5-c2c840c38b18.kohdennukset.0.rajoite.asetukset.0.tarkennin.paattymispaiva",
            properties: {
              value: "2021-02-28T07:26:00.000Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          },
          {
            anchor:
              "rajoitteet_13fc8b18-f169-4fc2-9ab5-c2c840c38b18.kohdennukset.0.rajoite.asetukset.0.tarkennin.alkamispaiva",
            properties: {
              value: "2021-02-23T07:26:09.860Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          }
        ],
        "a6ba91d4-fafe-4ac8-9572-f445882ef31f": [
          {
            anchor:
              "rajoitteet_a6ba91d4-fafe-4ac8-9572-f445882ef31f.kohdennukset.0.rajoite.kohde.valikko",
            properties: {
              value: {
                label: "Opetus, jota lupa koskee",
                value: "opetustehtavat"
              }
            }
          },
          {
            anchor:
              "rajoitteet_a6ba91d4-fafe-4ac8-9572-f445882ef31f.kohdennukset.0.rajoite.kohde.tarkennin.komponentti",
            properties: {
              value: {
                label: "esiopetus",
                value: "6"
              },
              metadata: {
                section: "getOpetustehtavatLomake"
              }
            }
          },
          {
            anchor:
              "rajoitteet_a6ba91d4-fafe-4ac8-9572-f445882ef31f.kohdennukset.0.rajoite.asetukset.0.kohde",
            properties: {
              value: {
                label: "Oppilaitokset",
                value: "oppilaitokset"
              }
            }
          },
          {
            anchor:
              "rajoitteet_a6ba91d4-fafe-4ac8-9572-f445882ef31f.kohdennukset.0.rajoite.asetukset.0.tarkennin.komponentti",
            properties: {
              value: [
                {
                  label: "Annalan koulu",
                  value: "1.2.246.562.10.320189452810"
                }
              ],
              metadata: {
                section: "oppilaitokset"
              }
            }
          },
          {
            anchor:
              "rajoitteet_a6ba91d4-fafe-4ac8-9572-f445882ef31f.kohdennukset.0.rajoite.asetukset.1.kohde",
            properties: {
              value: {
                label: "määräaika",
                value: "kujalisamaareetlisaksiajalla_1"
              }
            }
          },
          {
            anchor:
              "rajoitteet_a6ba91d4-fafe-4ac8-9572-f445882ef31f.kohdennukset.0.rajoite.asetukset.1.tarkennin.paattymispaiva",
            properties: {
              value: "2021-02-26T07:26:00.000Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          },
          {
            anchor:
              "rajoitteet_a6ba91d4-fafe-4ac8-9572-f445882ef31f.kohdennukset.0.rajoite.asetukset.1.tarkennin.alkamispaiva",
            properties: {
              value: "2021-02-23T07:26:48.830Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          }
        ],
        "0815e04b-b93c-40c5-abeb-1df317cafb0d": [
          {
            anchor:
              "rajoitteet_0815e04b-b93c-40c5-abeb-1df317cafb0d.kohdennukset.0.rajoite.kohde.valikko",
            properties: {
              value: {
                label: "Opetuskieli",
                value: "opetuskielet"
              }
            }
          },
          {
            anchor:
              "rajoitteet_0815e04b-b93c-40c5-abeb-1df317cafb0d.kohdennukset.0.rajoite.kohde.tarkennin.komponentti",
            properties: {
              value: {
                label: "hollanti",
                value: "NL"
              },
              metadata: {
                section: "opetuskielet"
              }
            }
          },
          {
            anchor:
              "rajoitteet_0815e04b-b93c-40c5-abeb-1df317cafb0d.kohdennukset.0.rajoite.asetukset.0.kohde",
            properties: {
              value: {
                label: "Kunnat, joissa opetusta järjestetään",
                value: "toimintaalue"
              }
            }
          },
          {
            anchor:
              "rajoitteet_0815e04b-b93c-40c5-abeb-1df317cafb0d.kohdennukset.0.rajoite.asetukset.0.tarkennin.komponentti",
            properties: {
              value: {
                label: "Kannonkoski",
                value: "216"
              },
              metadata: {
                section: "opetustaAntavatKunnat"
              }
            }
          }
        ],
        "ed36551d-2ac5-43e6-ba17-0d52df9ae097": [
          {
            anchor:
              "rajoitteet_ed36551d-2ac5-43e6-ba17-0d52df9ae097.kohdennukset.0.rajoite.kohde.valikko",
            properties: {
              value: {
                label: "Opetuskieli",
                value: "opetuskielet"
              }
            }
          },
          {
            anchor:
              "rajoitteet_ed36551d-2ac5-43e6-ba17-0d52df9ae097.kohdennukset.0.rajoite.kohde.tarkennin.komponentti",
            properties: {
              value: {
                label: "hollanti",
                value: "NL"
              },
              metadata: {
                section: "opetuskielet"
              }
            }
          },
          {
            anchor:
              "rajoitteet_ed36551d-2ac5-43e6-ba17-0d52df9ae097.kohdennukset.0.rajoite.asetukset.0.kohde",
            properties: {
              value: {
                label: "Oppilaitokset",
                value: "oppilaitokset"
              }
            }
          },
          {
            anchor:
              "rajoitteet_ed36551d-2ac5-43e6-ba17-0d52df9ae097.kohdennukset.0.rajoite.asetukset.0.tarkennin.komponentti",
            properties: {
              value: [
                {
                  label: "Pispalan koulu",
                  value: "1.2.246.562.10.59133532776"
                },
                {
                  label: "Tampereen seudun ammattiopisto Tredu",
                  value: "1.2.246.562.10.75542087673"
                }
              ],
              metadata: {
                section: "oppilaitokset"
              }
            }
          },
          {
            anchor:
              "rajoitteet_ed36551d-2ac5-43e6-ba17-0d52df9ae097.kohdennukset.0.rajoite.asetukset.1.kohde",
            properties: {
              value: {
                label: "määräaika",
                value: "kujalisamaareetlisaksiajalla_1"
              }
            }
          },
          {
            anchor:
              "rajoitteet_ed36551d-2ac5-43e6-ba17-0d52df9ae097.kohdennukset.0.rajoite.asetukset.1.tarkennin.paattymispaiva",
            properties: {
              value: "2021-03-31T06:34:00.000Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          },
          {
            anchor:
              "rajoitteet_ed36551d-2ac5-43e6-ba17-0d52df9ae097.kohdennukset.0.rajoite.asetukset.1.tarkennin.alkamispaiva",
            properties: {
              value: "2021-03-08T07:34:00.000Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          }
        ],
        "2f662b3a-03f0-4fca-ac79-d78389cbe1b4": [
          {
            anchor:
              "rajoitteet_2f662b3a-03f0-4fca-ac79-d78389cbe1b4.kohdennukset.0.rajoite.kohde.valikko",
            properties: {
              value: {
                label: "Kunnat, joissa opetusta järjestetään",
                value: "toimintaalue"
              }
            }
          },
          {
            anchor:
              "rajoitteet_2f662b3a-03f0-4fca-ac79-d78389cbe1b4.kohdennukset.0.rajoite.kohde.tarkennin.komponentti",
            properties: {
              value: {
                label: "Jyväskylä",
                value: "179"
              },
              metadata: {
                section: "opetustaAntavatKunnat"
              }
            }
          },
          {
            anchor:
              "rajoitteet_2f662b3a-03f0-4fca-ac79-d78389cbe1b4.kohdennukset.0.rajoite.asetukset.0.kohde",
            properties: {
              value: {
                label: "Opetus, jota lupa koskee",
                value: "opetustehtavat"
              }
            }
          },
          {
            anchor:
              "rajoitteet_2f662b3a-03f0-4fca-ac79-d78389cbe1b4.kohdennukset.0.rajoite.asetukset.0.tarkennin.komponentti",
            properties: {
              value: {
                label: "enintään kaksi vuotta kestävä esiopetus",
                value: "3"
              },
              metadata: {
                section: "getOpetustehtavatLomake"
              }
            }
          },
          {
            anchor:
              "rajoitteet_2f662b3a-03f0-4fca-ac79-d78389cbe1b4.kohdennukset.0.rajoite.asetukset.1.kohde",
            properties: {
              value: {
                label: "määräaika",
                value: "kujalisamaareetlisaksiajalla_1"
              }
            }
          },
          {
            anchor:
              "rajoitteet_2f662b3a-03f0-4fca-ac79-d78389cbe1b4.kohdennukset.0.rajoite.asetukset.1.tarkennin.paattymispaiva",
            properties: {
              value: "2021-02-28T07:30:00.000Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          },
          {
            anchor:
              "rajoitteet_2f662b3a-03f0-4fca-ac79-d78389cbe1b4.kohdennukset.0.rajoite.asetukset.1.tarkennin.alkamispaiva",
            properties: {
              value: "2021-02-23T07:30:45.068Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          }
        ],
        "9ab7ad9c-baf7-420a-a313-b1188dd6cd27": [
          {
            anchor:
              "rajoitteet_9ab7ad9c-baf7-420a-a313-b1188dd6cd27.kohdennukset.0.rajoite.kohde.valikko",
            properties: {
              value: {
                label: "Kunnat, joissa opetusta järjestetään",
                value: "toimintaalue"
              }
            }
          },
          {
            anchor:
              "rajoitteet_9ab7ad9c-baf7-420a-a313-b1188dd6cd27.kohdennukset.0.rajoite.kohde.tarkennin.komponentti",
            properties: {
              value: {
                label: "Jyväskylä",
                value: "179"
              },
              metadata: {
                section: "opetustaAntavatKunnat"
              }
            }
          },
          {
            anchor:
              "rajoitteet_9ab7ad9c-baf7-420a-a313-b1188dd6cd27.kohdennukset.0.rajoite.asetukset.0.kohde",
            properties: {
              value: {
                label: "Opetus, jota lupa koskee",
                value: "opetustehtavat"
              }
            }
          },
          {
            anchor:
              "rajoitteet_9ab7ad9c-baf7-420a-a313-b1188dd6cd27.kohdennukset.0.rajoite.asetukset.0.tarkennin.komponentti",
            properties: {
              value: {
                label:
                  "enintään kaksi vuotta kestävä esiopetus kehitysvammaisille ja psyykkisesti häiriytyneille lapsille",
                value: "2"
              },
              metadata: {
                section: "getOpetustehtavatLomake"
              }
            }
          },
          {
            anchor:
              "rajoitteet_9ab7ad9c-baf7-420a-a313-b1188dd6cd27.kohdennukset.0.rajoite.asetukset.1.kohde",
            properties: {
              value: {
                label: "määräaika",
                value: "kujalisamaareetlisaksiajalla_1"
              }
            }
          },
          {
            anchor:
              "rajoitteet_9ab7ad9c-baf7-420a-a313-b1188dd6cd27.kohdennukset.0.rajoite.asetukset.1.tarkennin.paattymispaiva",
            properties: {
              value: "2021-03-28T06:31:00.000Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          },
          {
            anchor:
              "rajoitteet_9ab7ad9c-baf7-420a-a313-b1188dd6cd27.kohdennukset.0.rajoite.asetukset.1.tarkennin.alkamispaiva",
            properties: {
              value: "2021-02-23T07:31:17.982Z",
              metadata: {
                section: "maaraaika",
                koodisto: "kujalisamaareet",
                koodiarvo: "3"
              }
            }
          }
        ]
      },
      muutEhdot: [
        {
          anchor: "muutEhdot.1.valintaelementti",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "muutEhdot.4.valintaelementti",
          properties: {
            isChecked: true
          }
        }
      ],
      opetuksenJarjestamismuodot: [
        {
          anchor: "opetuksenJarjestamismuodot.1.valinta",
          properties: {
            metadata: {
              koodiarvo: "1"
            },
            isChecked: true
          }
        },
        {
          anchor: "opetuksenJarjestamismuodot.0.valinta",
          properties: {
            isChecked: false
          }
        }
      ],
      opetustehtavat: [
        {
          anchor: "opetustehtavat.opetustehtava.6",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "opetustehtavat.opetustehtava.3",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "opetustehtavat.opetustehtava.2",
          properties: {
            isChecked: true
          }
        }
      ],
      opetuskielet: [
        {
          anchor: "opetuskielet.opetuskieli.ensisijaiset",
          properties: {
            value: [
              {
                label: "ruotsi",
                value: "SV"
              },
              {
                label: "arabia",
                value: "AR"
              },
              {
                label: "amhara",
                value: "AM"
              }
            ],
            metadata: {
              valikko: "ensisijaiset"
            }
          }
        },
        {
          anchor: "opetuskielet.opetuskieli.toissijaiset",
          properties: {
            value: [
              {
                label: "saksa",
                value: "DE"
              },
              {
                label: "hollanti",
                value: "NL"
              }
            ],
            metadata: {
              valikko: "toissijaiset"
            }
          }
        }
      ],
      toimintaalue: [
        {
          anchor: "toimintaalue.categoryFilter",
          properties: {
            changesByProvince: {
              "FI-08": [
                {
                  anchor: "areaofaction.FI-08.kunnat.179",
                  properties: {
                    metadata: {
                      title: "Jyväskylä",
                      koodiarvo: "179",
                      maakuntaKey: "FI-08"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-08.A",
                  properties: {
                    metadata: {
                      koodiarvo: "13",
                      maakuntaKey: "FI-08"
                    },
                    isChecked: true,
                    isIndeterminate: true
                  }
                },
                {
                  anchor: "areaofaction.FI-08.kunnat.216",
                  properties: {
                    metadata: {
                      title: "Kannonkoski",
                      koodiarvo: "216",
                      maakuntaKey: "FI-08"
                    },
                    isChecked: true
                  }
                }
              ],
              "FI-10": [
                {
                  anchor: "areaofaction.FI-10.kunnat.742",
                  properties: {
                    metadata: {
                      title: "Savukoski",
                      koodiarvo: "742",
                      maakuntaKey: "FI-10"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.A",
                  properties: {
                    metadata: {
                      koodiarvo: "19",
                      maakuntaKey: "FI-10"
                    },
                    isChecked: true,
                    isIndeterminate: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.758",
                  properties: {
                    metadata: {
                      title: "Sodankylä",
                      koodiarvo: "758",
                      maakuntaKey: "FI-10"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.845",
                  properties: {
                    metadata: {
                      title: "Tervola",
                      koodiarvo: "845",
                      maakuntaKey: "FI-10"
                    },
                    isChecked: true
                  }
                }
              ]
            },
            quickFilterChanges: [
              {
                anchor: "areaofaction-radios.quick-filters.ei-alueita",
                properties: {
                  metadata: {
                    koodiarvo: "FI2"
                  },
                  isChecked: false
                }
              }
            ]
          }
        },
        {
          anchor: "toimintaalue.ulkomaa.200",
          properties: {
            metadata: {
              versio: 2,
              koodisto: {
                koodistoUri: "kunta"
              },
              koodiarvo: "200",
              voimassaAlkuPvm: "1990-01-01"
            },
            isChecked: true
          }
        },
        {
          anchor: "toimintaalue.ulkomaa.200.lisatiedot",
          properties: {
            value: "Ulkomaan kunta 1",
            metadata: {
              versio: 2,
              koodisto: {
                koodistoUri: "kunta"
              },
              koodiarvo: "200",
              voimassaAlkuPvm: "1990-01-01"
            }
          }
        },
        {
          anchor: "toimintaalue.ulkomaa.200.1.lisatiedot",
          properties: {
            value: "Ulkomaan kunta 2",
            metadata: {
              ankkuri: "1",
              koodisto: {
                koodistoUri: "kunta"
              },
              koodiarvo: "200"
            }
          }
        },
        {
          anchor: "toimintaalue.ulkomaa.200.2.lisatiedot",
          properties: {
            value: "Ulkomaan kunta 3",
            metadata: {
              ankkuri: "2",
              koodisto: {
                koodistoUri: "kunta"
              },
              koodiarvo: "200"
            }
          }
        }
      ],
      topthree: [],
      paatoksentiedot: [
        {
          anchor: "paatoksentiedot.voimaantulopaiva.A",
          properties: {
            value: "2021-02-23T07:19:00.000Z",
            metadata: {}
          }
        },
        {
          anchor: "paatoksentiedot.asianumero.A",
          properties: {
            value: "VN/0000/0001"
          }
        },
        {
          anchor: "paatoksentiedot.paatospaiva.A",
          properties: {
            value: "2021-02-18T07:19:13.836Z",
            metadata: {}
          }
        },
        {
          anchor: "paatoksentiedot.paattymispaivamaara.A",
          properties: {
            value: "2021-04-30T06:42:00.000Z",
            metadata: {}
          }
        }
      ]
    },
    unsaved: {},
    underRemoval: {}
  },
  focusOn: null,
  latestChanges: {},
  validity: {},
  isRestrictionDialogVisible: false,
  isPreviewModeOn: false
};
