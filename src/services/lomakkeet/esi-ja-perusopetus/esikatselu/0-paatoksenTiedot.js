import { __mf } from "i18n-for-browser";
import { find, path } from "ramda";
import moment from "moment";

export async function previewOfPaatoksentiedot({ lomakedata }) {
  const paattymispvm = path(
    ["properties", "value"],
    find(
      cObj => cObj.anchor === "paatoksentiedot.paattymispaivamaara.A",
      lomakedata || []
    )
  );

  return paattymispvm
    ? {
        structure: [
          {
            anchor: "paattymispvm",
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                properties: {
                  code: `${__mf("common.onVoimassa", {
                    loppupvm: moment(paattymispvm).format("DD.MM.YYYY")
                  })}`
                }
              }
            ]
          }
        ]
      }
    : {};
}
