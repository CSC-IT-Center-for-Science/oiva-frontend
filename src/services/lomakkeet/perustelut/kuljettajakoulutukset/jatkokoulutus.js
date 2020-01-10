import {
  tehtavanTarpeellisuus,
  voimassaOlo,
  suunnitelma,
  osaaminen,
  johtaja,
  opettajien,
  ajoneuvoKanta,
  muutOpetusvalineet
} from "../lomakeosiot/kuljettajakoulutukset";

export function getAdditionForm(isReadOnly) {
  return [
    {
      anchor: 6,
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
          6,
          "Selvitys jatkokoulutuksen opettajien kelpoisuuksista ja työkokemuksista",
          isReadOnly
        ),
        ajoneuvoKanta(7, isReadOnly),
        muutOpetusvalineet(8, isReadOnly)
      ]
    }
  ];
}
