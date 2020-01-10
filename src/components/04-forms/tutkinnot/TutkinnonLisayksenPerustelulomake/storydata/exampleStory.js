import * as R from "ramda";

export const exampleStory = {
  changes: [],
  checkboxItems: R.sortBy(R.prop("koodiArvo"), [
    {
      koodiArvo: "3",
      koodisto: { koodistoUri: "oivaperustelut" },
      versio: 1,
      metadata: [
        {
          kieli: "FI",
          nimi: "Koulutuksen järjestäjän koulutustarjonnan kysyntä",
          kuvaus: "",
          kasite: "",
          huomioitavaKoodi: "",
          sisaltaaMerkityksen: ""
        },
        {
          kieli: "SV",
          nimi: "Efterfrågan på utbildningsanordnarens utbildningsutbud",
          kuvaus: "",
          kasite: "",
          huomioitavaKoodi: "",
          sisaltaaMerkityksen: ""
        }
      ],
      voimassaAlkuPvm: "2018-01-01"
    },
    {
      koodiArvo: "4",
      koodisto: { koodistoUri: "oivaperustelut" },
      versio: 1,
      metadata: [
        {
          kieli: "FI",
          nimi: "Muut syyt",
          kuvaus: "",
          kasite: "",
          huomioitavaKoodi: "",
          sisaltaaMerkityksen: ""
        },
        {
          kieli: "SV",
          nimi: "Övriga orsaker",
          kuvaus: "",
          kasite: "",
          huomioitavaKoodi: "",
          sisaltaaMerkityksen: ""
        }
      ],
      voimassaAlkuPvm: "2019-01-01"
    },
    {
      koodiArvo: "2",
      koodisto: { koodistoUri: "oivaperustelut" },
      versio: 1,
      metadata: [
        {
          kieli: "FI",
          nimi: "Alueen väestön koulutustarve",
          kuvaus: "",
          kasite: "",
          huomioitavaKoodi: "",
          sisaltaaMerkityksen: ""
        },
        {
          kieli: "SV",
          nimi: "Utbildningsbehovet hos befolkningen inom regionen",
          kuvaus: "",
          kasite: "",
          huomioitavaKoodi: "",
          sisaltaaMerkityksen: ""
        }
      ],
      voimassaAlkuPvm: "2018-01-01"
    },
    {
      koodiArvo: "1",
      koodisto: { koodistoUri: "oivaperustelut" },
      versio: 1,
      metadata: [
        {
          kieli: "SV",
          nimi: "Arbetskraftsbehovet inom arbets- och näringslivet i regionen",
          kuvaus: "",
          kasite: "",
          huomioitavaKoodi: "",
          sisaltaaMerkityksen: ""
        },
        {
          kieli: "FI",
          nimi: "Alueen työ- ja elinkeinoelämän työvoimatarve",
          kuvaus: "",
          kasite: "",
          huomioitavaKoodi: "",
          sisaltaaMerkityksen: ""
        }
      ],
      voimassaAlkuPvm: "2018-01-01"
    }
  ])
};
