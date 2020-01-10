import {
  tehtavanTarpeellisuus,
  voimassaOlo,
  opettajien,
  ajoneuvoKanta,
  muutOpetusvalineet,
  johtajienKelpoisuusJaTyokokemus
} from "../lomakeosiot/kuljettajakoulutukset";
import opiskelijavuodet from "../lomakeosiot/opiskelijavuodet";

export function getAdditionForm(isReadOnly) {
  return [
    {
      anchor: 5,
      styleClasses: ["px-10 py-10"],
      components: [
        {
          anchor: "peruskoulutus-title",
          name: "StatusTextRow",
          properties: {
            title:
              "Perustason ammattipätevyyskoulutusta antavan koulutuskeskuksen tehtävä"
          }
        }
      ],
      categories: [
        tehtavanTarpeellisuus(1, isReadOnly),
        voimassaOlo(2, isReadOnly),
        {
          anchor: "suunnitelma",
          code: 3,
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
                    title:
                      "Esittäkää suunnitelma ammattipätevyyskoulutuksen toteutuksesta"
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: "ammattipatevyyskoulutuksen-jarjestamispaikat",
          code: 4,
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
                      "Esittäkää selvitys koulutuksen järjestämispaikoista",
                    title: "Ammattipätevyyskoulutuksen järjestämispaikat"
                  }
                }
              ]
            }
          ]
        },
        opiskelijavuodet(5, 4, isReadOnly),
        johtajienKelpoisuusJaTyokokemus(
          6,
          "Merkitse opetuksesta vastaavien johtajien lukumäärä, joilla on alla olevien kohtien mukainen kelpoisuus ja työkokemus.",
          isReadOnly
        ),
        opettajien(
          7,
          "Merkitse niiden opettajien lukumäärä, joilla on alla olevien kohtien mukainen kelpoisuus ja työkokemus.",
          isReadOnly
        ),
        ajoneuvoKanta(8, isReadOnly),
        muutOpetusvalineet(9, isReadOnly)
      ]
    }
  ];
}
